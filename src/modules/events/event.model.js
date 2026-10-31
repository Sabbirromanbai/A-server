import { getDb } from "../../config/db.js";

const eventFields = [
  "title",
  "description",
  "eventType",
  "thumbnailUrl",
  "location",
  "eventDate",
];
const eventTypes = new Set([
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
]);
const fieldMaxLengths = {
  title: 120,
  description: 5000,
  eventType: 50,
  thumbnailUrl: 2048,
  location: 200,
  eventDate: 64,
};

function validateEventData(event) {
  const errors = [];

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return {
      errors: ["Request body must be a JSON object."],
      eventDate: undefined,
    };
  }

  for (const field of Object.keys(event)) {
    if (!eventFields.includes(field)) {
      errors.push(`${field} is not allowed.`);
    }
  }

  for (const field of eventFields) {
    if (typeof event[field] !== "string" || !event[field].trim()) {
      errors.push(`${field} is required and must be a non-empty string.`);
      continue;
    }

    if (event[field].trim().length > fieldMaxLengths[field]) {
      errors.push(`${field} must be ${fieldMaxLengths[field]} characters or fewer.`);
    }
  }

  if (
    typeof event.eventType === "string" &&
    event.eventType.trim() &&
    !eventTypes.has(event.eventType.trim())
  ) {
    errors.push("eventType must be a supported event type.");
  }

  if (typeof event.thumbnailUrl === "string" && event.thumbnailUrl.trim()) {
    try {
      const thumbnailUrl = new URL(event.thumbnailUrl.trim());
      if (
        !["http:", "https:"].includes(thumbnailUrl.protocol) ||
        !thumbnailUrl.hostname ||
        thumbnailUrl.username ||
        thumbnailUrl.password
      ) {
        errors.push("thumbnailUrl must be a valid HTTP or HTTPS URL.");
      }
    } catch {
      errors.push("thumbnailUrl must be a valid HTTP or HTTPS URL.");
    }
  }

  let eventDate;
  if (typeof event.eventDate === "string" && event.eventDate.trim()) {
    eventDate = new Date(event.eventDate.trim());

    if (Number.isNaN(eventDate.getTime())) {
      errors.push("eventDate must be a valid date.");
    } else if (eventDate.getTime() <= Date.now()) {
      errors.push("eventDate must be in the future.");
    }
  }

  return { errors, eventDate };
}

export function validateEvent(event) {
  return validateEventData(event);
}

export function validateEventUpdate(event) {
  return validateEventData(event);
}

export async function createEvent(event, eventDate, creatorEmail) {
  const newEvent = {
    title: event.title.trim(),
    description: event.description.trim(),
    eventType: event.eventType.trim(),
    thumbnailUrl: event.thumbnailUrl.trim(),
    location: event.location.trim(),
    eventDate,
    creatorEmail,
    createdAt: new Date(),
  };

  const result = await getDb().collection("events").insertOne(newEvent);
  return { ...newEvent, _id: result.insertedId };
}

export function toEventResponse(event) {
  const { creatorEmail, ...response } = event;
  return response;
}

export async function getUpcomingEvents(limit) {
  const cursor = getDb()
    .collection("events")
    .find({ eventDate: { $gt: new Date() } })
    .sort({ eventDate: 1 });

  if (limit !== undefined) {
    cursor.limit(limit);
  }

  return cursor.toArray();
}

export async function getEventsByCreatorEmail(email) {
  return getDb()
    .collection("events")
    .find({ creatorEmail: email })
    .sort({ eventDate: 1 })
    .toArray();
}

export async function getEventById(id) {
  return getDb().collection("events").findOne({ _id: id });
}

export async function updateEvent(id, event, eventDate, creatorEmail) {
  const updatedFields = {
    title: event.title.trim(),
    description: event.description.trim(),
    eventType: event.eventType.trim(),
    thumbnailUrl: event.thumbnailUrl.trim(),
    location: event.location.trim(),
    eventDate,
  };

  const events = getDb().collection("events");

  const result = await events.updateOne(
    { _id: id, creatorEmail },
    { $set: updatedFields }
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return events.findOne({ _id: id });
}

export async function deleteEvent(id, creatorEmail) {
  const result = await getDb()
    .collection("events")
    .deleteOne({ _id: id, creatorEmail });

  return result.deletedCount > 0;
}

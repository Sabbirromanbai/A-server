import { getDb } from "../../config/db.js";

const requiredFields = [
  "title",
  "description",
  "eventType",
  "thumbnailUrl",
  "location",
  "eventDate",
];
const updatableFields = [
  "title",
  "description",
  "eventType",
  "thumbnailUrl",
  "location",
  "eventDate",
];

export function validateEvent(event) {
  const errors = [];

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return { errors: ["Request body must be a JSON object."] };
  }

  for (const field of requiredFields) {
    if (typeof event[field] !== "string" || !event[field].trim()) {
      errors.push(`${field} is required and must be a non-empty string.`);
    }
  }

  let eventDate;
  if (typeof event.eventDate === "string" && event.eventDate.trim()) {
    eventDate = new Date(event.eventDate);

    if (Number.isNaN(eventDate.getTime())) {
      errors.push("eventDate must be a valid date.");
    } else if (eventDate.getTime() <= Date.now()) {
      errors.push("eventDate must be in the future.");
    }
  }

  return { errors, eventDate };
}

export function validateEventUpdate(event) {
  const errors = [];

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return { errors: ["Request body must be a JSON object."] };
  }

  for (const field of updatableFields) {
    if (typeof event[field] !== "string" || !event[field].trim()) {
      errors.push(`${field} is required and must be a non-empty string.`);
    }
  }

  const eventDate = new Date(event.eventDate);
  if (typeof event.eventDate === "string" && event.eventDate.trim()) {
    if (Number.isNaN(eventDate.getTime())) {
      errors.push("eventDate must be a valid date.");
    } else if (eventDate.getTime() <= Date.now()) {
      errors.push("eventDate must be in the future.");
    }
  }

  return { errors, eventDate };
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

export async function getUpcomingEvents() {
  return getDb()
    .collection("events")
    .find({ eventDate: { $gt: new Date() } })
    .sort({ eventDate: 1 })
    .toArray();
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

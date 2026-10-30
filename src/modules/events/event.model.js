import { getDb } from "../../config/db.js";

const requiredFields = [
  "title",
  "description",
  "eventType",
  "thumbnailUrl",
  "location",
  "eventDate",
  "creatorEmail",
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

export async function createEvent(event, eventDate) {
  const newEvent = {
    title: event.title.trim(),
    description: event.description.trim(),
    eventType: event.eventType.trim(),
    thumbnailUrl: event.thumbnailUrl.trim(),
    location: event.location.trim(),
    eventDate,
    creatorEmail: event.creatorEmail.trim(),
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

import { ObjectId } from "mongodb";
import {
  createEvent,
  deleteEvent,
  getEventsByCreatorEmail,
  getEventById,
  getUpcomingEvents,
  updateEvent,
  validateEvent,
  validateEventUpdate,
} from "./event.model.js";

export async function removeEvent(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid event ID.",
    });
  }

  try {
    const deleted = await deleteEvent(new ObjectId(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete event.",
    });
  }
}

export async function putEvent(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid event ID.",
    });
  }

  const { errors, eventDate } = validateEventUpdate(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid event data.",
      errors,
    });
  }

  try {
    const event = await updateEvent(new ObjectId(id), req.body, eventDate);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    console.error("Failed to update event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update event.",
    });
  }
}

export async function getEvent(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid event ID.",
    });
  }

  try {
    const event = await getEventById(new ObjectId(id));

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch event.",
    });
  }
}

export async function getEvents(req, res) {
  try {
    const events = await getUpcomingEvents();

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events.",
    });
  }
}

export async function getMyEvents(req, res) {
  const { email } = req.query;

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "A non-empty email query parameter is required.",
    });
  }

  try {
    const events = await getEventsByCreatorEmail(email.trim());

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Failed to fetch creator events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch creator events.",
    });
  }
}

export async function postEvent(req, res) {
  const { errors, eventDate } = validateEvent(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid event data.",
      errors,
    });
  }

  try {
    const event = await createEvent(req.body, eventDate);

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event.",
    });
  }
}

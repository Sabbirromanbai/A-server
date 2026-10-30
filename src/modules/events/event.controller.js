import {
  createEvent,
  getUpcomingEvents,
  validateEvent,
} from "./event.model.js";

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

import { ObjectId } from "mongodb";
import { createParticipant, getJoinedEvents } from "./participant.model.js";

export async function getParticipants(req, res) {
  const email = req.query.email;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid email query parameter is required.",
    });
  }

  try {
    const events = await getJoinedEvents(email.trim().toLowerCase());

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Failed to fetch joined events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch joined events.",
    });
  }
}

export async function postParticipant(req, res) {
  const { eventId, userEmail } = req.body ?? {};

  if (
    typeof eventId !== "string" ||
    !/^[0-9a-fA-F]{24}$/.test(eventId) ||
    !ObjectId.isValid(eventId) ||
    typeof userEmail !== "string" ||
    !userEmail.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid eventId and non-empty userEmail are required.",
    });
  }

  try {
    const participant = await createParticipant(
      new ObjectId(eventId),
      userEmail.trim().toLowerCase(),
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Joined event successfully.",
      participant,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User has already joined this event.",
      });
    }

    console.error("Failed to join event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to join event.",
    });
  }
}

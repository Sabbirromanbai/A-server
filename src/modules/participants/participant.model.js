import { getDb } from "../../config/db.js";

let participantIndexPromise;

async function ensureParticipantUniqueIndex() {
  if (!participantIndexPromise) {
    participantIndexPromise = getDb()
      .collection("participants")
      .createIndex({ eventId: 1, userEmail: 1 }, { unique: true })
      .catch((error) => {
        participantIndexPromise = undefined;
        throw error;
      });
  }

  return participantIndexPromise;
}

export async function createParticipant(eventId, userEmail) {
  const db = getDb();
  const event = await db.collection("events").findOne({ _id: eventId });

  if (!event) {
    return null;
  }

  await ensureParticipantUniqueIndex();

  const participant = {
    eventId,
    userEmail,
    joinedAt: new Date(),
  };
  const result = await db.collection("participants").insertOne(participant);

  return { ...participant, _id: result.insertedId };
}

export async function getJoinedEvents(userEmail) {
  const db = getDb();
  const participants = await db
    .collection("participants")
    .find({ userEmail }, { projection: { eventId: 1, _id: 0 } })
    .toArray();

  if (participants.length === 0) {
    return [];
  }

  const eventIds = participants.map((participant) => participant.eventId);

  return db
    .collection("events")
    .find({ _id: { $in: eventIds } })
    .sort({ eventDate: 1 })
    .toArray();
}

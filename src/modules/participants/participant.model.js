import { getDb } from "../../config/db.js";
import { getPublicUserProfiles } from "../users/user.model.js";
import { toEventResponse } from "../events/event.model.js";

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

export async function deleteParticipant(eventId, userEmail) {
  const result = await getDb()
    .collection("participants")
    .deleteOne({ eventId, userEmail });

  return result.deletedCount > 0;
}

export async function getJoinedEvents(userEmail) {
  const db = getDb();
  const participants = await db
    .collection("participants")
    .find(
      { userEmail },
      { projection: { eventId: 1, joinedAt: 1, _id: 0 } },
    )
    .toArray();

  if (participants.length === 0) {
    return [];
  }

  const eventIds = participants.map((participant) => participant.eventId);
  const joinedAtByEvent = new Map(
    participants.map((participant) => [
      String(participant.eventId),
      participant.joinedAt,
    ]),
  );

  const events = await db
    .collection("events")
    .find({ _id: { $in: eventIds } })
    .sort({ eventDate: 1 })
    .toArray();

  return events.map((event) => ({
    ...toEventResponse(event),
    joinedAt: joinedAtByEvent.get(String(event._id)) ?? null,
  }));
}

export async function getEventParticipants(eventId) {
  const participants = await getDb()
    .collection("participants")
    .find({ eventId }, { projection: { userEmail: 1, _id: 0 } })
    .sort({ joinedAt: 1 })
    .toArray();
  const profiles = await getPublicUserProfiles(
    participants.map((participant) => participant.userEmail),
  );
  const profilesByEmail = new Map(
    profiles.map((profile) => [profile.email, profile]),
  );

  return {
    count: participants.length,
    volunteers: participants.map((participant) => {
      const profile = profilesByEmail.get(participant.userEmail);
      return {
        name: profile?.name || "Community volunteer",
        image: profile?.image,
      };
    }),
  };
}

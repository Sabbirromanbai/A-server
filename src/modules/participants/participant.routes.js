
import { Router } from "express";
import {
  deleteParticipantMembership,
  getEventParticipantList,
  getParticipants,
  postParticipant,
} from "./participant.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const participantRouter = Router();

participantRouter.get("/event/:eventId", getEventParticipantList);
participantRouter.get("/", verifyToken, getParticipants);
participantRouter.post("/", verifyToken, postParticipant);
participantRouter.delete("/", verifyToken, deleteParticipantMembership);

export default participantRouter;

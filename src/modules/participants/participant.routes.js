import { Router } from "express";
import {
  getParticipants,
  postParticipant,
} from "./participant.controller.js";

const participantRouter = Router();

participantRouter.get("/", getParticipants);
participantRouter.post("/", postParticipant);

export default participantRouter;

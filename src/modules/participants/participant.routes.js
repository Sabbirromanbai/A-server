
import { Router } from "express";
import {
  getParticipants,
  postParticipant,
} from "./participant.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const participantRouter = Router();

participantRouter.get("/", verifyToken, getParticipants);
participantRouter.post("/", verifyToken, postParticipant);

export default participantRouter;

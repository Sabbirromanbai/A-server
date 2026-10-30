
import { Router } from "express";
import {
  getEvent,
  getEvents,
  getMyEvents,
  postEvent,
  putEvent,
  removeEvent,
} from "./event.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const eventRouter = Router();

// Public routes
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEvent);

// Protected routes
eventRouter.get("/my-events", verifyToken, getMyEvents);
eventRouter.post("/", verifyToken, postEvent);
eventRouter.put("/:id", verifyToken, putEvent);
eventRouter.delete("/:id", verifyToken, removeEvent);

export default eventRouter;

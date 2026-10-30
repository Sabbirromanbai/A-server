import { Router } from "express";
import {
  getEvent,
  getEvents,
  postEvent,
  putEvent,
  removeEvent,
} from "./event.controller.js";

const eventRouter = Router();

eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEvent);
eventRouter.post("/", postEvent);
eventRouter.put("/:id", putEvent);
eventRouter.delete("/:id", removeEvent);

export default eventRouter;

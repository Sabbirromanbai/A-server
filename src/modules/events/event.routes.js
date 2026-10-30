import { Router } from "express";
import { getEvent, getEvents, postEvent } from "./event.controller.js";

const eventRouter = Router();

eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEvent);
eventRouter.post("/", postEvent);

export default eventRouter;

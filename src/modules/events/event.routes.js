import { Router } from "express";
import { getEvents, postEvent } from "./event.controller.js";

const eventRouter = Router();

eventRouter.get("/", getEvents);
eventRouter.post("/", postEvent);

export default eventRouter;

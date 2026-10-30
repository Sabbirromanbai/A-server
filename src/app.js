import cors from "cors";
import express from "express";
import eventRouter from "./modules/events/event.routes.js";
import participantRouter from "./modules/participants/participant.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/events", eventRouter);
app.use("/api/participants", participantRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api", (req, res) => {
  res.send("API is running");
});

export default app;


import cors from "cors";
import express from "express";
import eventRouter from "./modules/events/event.routes.js";
import participantRouter from "./modules/participants/participant.routes.js";

const app = express();
const allowedClientOrigins = new Set(["https://a-client-beta.vercel.app"]);
const configuredClientUrl = process.env.CLIENT_URL?.trim();

if (configuredClientUrl) {
  let clientUrl;
  try {
    clientUrl = new URL(configuredClientUrl);
  } catch {
    throw new Error("CLIENT_URL must be an absolute HTTP(S) URL.");
  }

  if (
    !["http:", "https:"].includes(clientUrl.protocol) ||
    (process.env.NODE_ENV === "production" && clientUrl.protocol !== "https:") ||
    clientUrl.username ||
    clientUrl.password
  ) {
    throw new Error("CLIENT_URL must be an absolute HTTPS URL in production.");
  }

  allowedClientOrigins.add(clientUrl.origin);
} else {
  allowedClientOrigins.add("http://localhost:3000");
}

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || allowedClientOrigins.has(origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/events", eventRouter);
app.use("/api/participants", participantRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api", (req, res) => {
  res.send("API is running");
});

export default app;

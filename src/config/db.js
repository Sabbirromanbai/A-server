import { MongoClient } from "mongodb";

let client;
let db;

export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db();

  await Promise.all([
    db.collection("events").createIndex({ eventDate: 1 }),
    db.collection("events").createIndex({ creatorEmail: 1 }),
  ]);

  console.log("You successfully connected to MongoDB!");
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("MongoDB has not been connected.");
  }

  return db;
}

export function getAuthDb() {
  if (!client) {
    throw new Error("MongoDB has not been connected.");
  }

  return client.db(process.env.DB_NAME || "goodtogether");
}

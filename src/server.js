import "dotenv/config";
import app from "./app.js";
import { connectToMongoDB } from "./config/db.js";

const port = process.env.PORT || 5000;

async function startServer() {
  await connectToMongoDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});

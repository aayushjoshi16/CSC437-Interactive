import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { connectMongo } from "./connectMongo";
import { PostProvider } from "./providers/PostProvider";
import { CredentialsProvider } from "./providers/CredentialsProvider";
import { registerPostRoutes } from "./routes/postRoutes";
import { registerAuthRoutes } from "./routes/authRoutes";

import { ValidRoutes } from "./shared/ValidRoutes";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";
let mongoClient: MongoClient;
let postProvider: PostProvider;
let credentialsProvider: CredentialsProvider;

const app = express();
app.use(express.json());

// Connect to MongoDB
(async () => {
  try {
    mongoClient = await connectMongo();
    postProvider = new PostProvider(mongoClient);
    credentialsProvider = new CredentialsProvider(mongoClient);
    console.log("MongoDB connection established successfully.");

    // Register routes after successful MongoDB connection
    // app.use("/api/*", verifyAuthToken);
    registerPostRoutes(app, postProvider);
    registerAuthRoutes(app, credentialsProvider);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
})();
app.use(express.static(STATIC_DIR));

app.get("/api/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

// Dynamic route handler for all valid frontend routes
Object.values(ValidRoutes).forEach((route) => {
  app.get(route, (req: Request, res: Response) => {
    const indexPath = path.join(__dirname, "../../frontend/dist/index.html");
    res.sendFile(indexPath);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

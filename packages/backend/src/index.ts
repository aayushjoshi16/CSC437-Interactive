import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { connectMongo } from "./connectMongo";
import { PostProvider } from "./providers/PostProvider";
import { CredentialsProvider } from "./providers/CredentialsProvider";
import { UserProfileProvider } from "./providers/UserProfileProvider";
import { registerPostRoutes } from "./routes/postRoutes";
import { registerAuthRoutes } from "./routes/authRoutes";
import { registerUserProfileRoutes } from "./routes/userProfileRoutes";
import { ValidRoutes } from "./shared/ValidRoutes";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

// Safely read and store JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error(
    "JWT_SECRET is required but not found in environment variables"
  );
  process.exit(1);
}

let mongoClient: MongoClient;
let postProvider: PostProvider;
let credentialsProvider: CredentialsProvider;
let userProfileProvider: UserProfileProvider;

const app = express();
app.use(express.json());

// Store JWT_SECRET in app.locals for access in request handlers
app.locals.JWT_SECRET = JWT_SECRET;

// Connect to MongoDB
(async () => {
  try {
    mongoClient = await connectMongo();
    postProvider = new PostProvider(mongoClient);
    credentialsProvider = new CredentialsProvider(mongoClient);
    userProfileProvider = new UserProfileProvider(mongoClient);

    console.log("MongoDB connection established successfully."); // Register routes after successful MongoDB connection

    registerAuthRoutes(app, credentialsProvider, userProfileProvider);
    registerPostRoutes(app, postProvider);
    registerUserProfileRoutes(app, userProfileProvider);

    // Catch-all route handler
    app.get("*", (req: Request, res: Response) => {
      if (req.path.startsWith("/api/")) {
        res.status(404).json({ error: "API endpoint not found" });
        return;
      }
      
      const indexPath = path.join(__dirname, "../../frontend/dist/index.html");
      res.sendFile(indexPath);
    });

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

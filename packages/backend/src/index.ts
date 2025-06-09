import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { ValidRoutes } from "./shared/ValidRoutes";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

const app = express();
app.use(express.static(STATIC_DIR));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

// API routes can go here
Object.values(ValidRoutes).forEach((route) => {
  // Create actual API endpoints if needed
  app.get(`/api${route}`, (req: Request, res: Response) => {
    res.send(`API endpoint for route: ${route}`);
  });
});

// Important: This catch-all route should be defined AFTER all other API routes
// This sends the main index.html for any path that doesn't match an API or static file
// allowing client-side routing to take over
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(STATIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

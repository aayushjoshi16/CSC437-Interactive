import { Express, Request, Response } from "express";
import { PostProvider } from "../providers/PostProvider";

export function registerPostRoutes(app: Express, postProvider: PostProvider) {
  // Route to get all posts
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const posts = await postProvider.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error retrieving posts:", error);
      res.status(500).json({ error: "Failed to retrieve posts" });
    }
  });
}

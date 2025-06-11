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

  // Route to create a new post
  app.post("/api/posts", async (req: Request, res: Response) => {
    const { user, game, description } = req.body;

    if (!user || !game || !description) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const newPost = {
        user,
        game,
        description,
        votes: [],
        timestamp: new Date(),
      };

      const createdPost = await postProvider.createPost(newPost);
      res.status(201).json(createdPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });
}

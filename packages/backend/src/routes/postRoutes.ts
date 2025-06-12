import { Express, Request, Response } from "express";
import { PostProvider } from "../providers/PostProvider";
import { verifyAuthToken } from "../middleware/authMiddleware";

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
  app.post("/api/posts", verifyAuthToken, async (req: Request, res: Response) => {
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

  // Route to toggle vote on a post
  app.post("/api/posts/:postId/vote", verifyAuthToken, async (req: Request, res: Response) => {
    const { postId } = req.params;
    const username = req.user?.username;

    if (!username) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      // Get the current post to check if user has already voted
      const post = await postProvider.getPostById(postId);
      
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }

      const hasVoted = post.votes.includes(username);

      if (hasVoted) {
        // Remove vote
        await postProvider.removeVote(postId, username);
        res.json({ 
          message: "Vote removed successfully", 
          voted: false, 
          voteCount: post.votes.length - 1 
        });
      } else {
        // Add vote
        await postProvider.addVote(postId, username);
        res.json({ 
          message: "Vote added successfully", 
          voted: true, 
          voteCount: post.votes.length + 1 
        });
      }
    } catch (error) {
      console.error("Error toggling vote:", error);
      res.status(500).json({ error: "Failed to toggle vote" });
    }
  });
}

import { Express, Request, Response } from "express";
import { PostProvider } from "../providers/PostProvider";
import { verifyAuthToken } from "../middleware/authMiddleware";

export function registerPostRoutes(app: Express, postProvider: PostProvider) {
  // Route to get paginated posts
  app.get("/api/posts", verifyAuthToken, async (req: Request, res: Response) => {
      try {
        // Extract pagination parameters from query string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchTerm = (req.query.search as string) || "";

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 50) {
          res.status(400).json({
            error:
              "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 50.",
          });
          return;
        }

        // Get paginated posts with optional search
        const paginatedResult = await postProvider.getPaginatedPosts({
          page,
          limit,
          searchTerm,
        });
        res.json(paginatedResult);
      } catch (error) {
        console.error("Error retrieving posts:", error);
        res.status(500).json({ error: "Failed to retrieve posts" });
      }
    }
  );

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
    }
  );

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
            voteCount: post.votes.length - 1,
          });
        } else {
          // Add vote
          await postProvider.addVote(postId, username);
          res.json({
            message: "Vote added successfully",
            voted: true,
            voteCount: post.votes.length + 1,
          });
        }
      } catch (error) {
        console.error("Error toggling vote:", error);
        res.status(500).json({ error: "Failed to toggle vote" });
      }
    }
  );

  // Route to get paginated posts for a specific user
  app.get("/api/posts/user/:username", verifyAuthToken, async (req: Request, res: Response) => {
      try {
        const { username } = req.params;

        // Extract pagination parameters from query string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 50) {
          res.status(400).json({
            error:
              "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 50.",
          });
          return;
        }

        // Get paginated posts for the specified user
        const paginatedResult = await postProvider.getUserPaginatedPosts(
          username,
          {
            page,
            limit,
          }
        );
        res.json(paginatedResult);
      } catch (error) {
        console.error("Error retrieving user posts:", error);
        res.status(500).json({ error: "Failed to retrieve user posts" });
      }
    }
  );
}

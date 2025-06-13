import { Express, Request, Response } from "express";
import { UserProfileProvider } from "../providers/UserProfileProvider";
import { verifyAuthToken } from "../middleware/authMiddleware";

export function registerUserProfileRoutes(
  app: Express,
  userProfileProvider: UserProfileProvider
) {
  // Get user profile
  app.get(
    "/api/profile/:username",
    verifyAuthToken,
    async (req: Request, res: Response) => {
      try {
        const { username } = req.params;

        const profile = await userProfileProvider.getUserProfile(username);

        if (!profile) {
          res.status(404).json({ error: "User profile not found" });
          return;
        }

        res.json(profile);
      } catch (error) {
        console.error("Error retrieving user profile:", error);
        res.status(500).json({ error: "Failed to retrieve user profile" });
      }
    }
  );

  // Update user profile
  app.put(
    "/api/profile/:username",
    verifyAuthToken,
    async (req: Request, res: Response) => {
      try {
        const { username } = req.params;
        const { email } = req.body;

        // Users can only update their own profile
        if (!req.user || req.user.username !== username) {
          res
            .status(403)
            .json({ error: "You can only update your own profile" });
          return;
        }

        const updates: any = {};
        if (email !== undefined) {
          updates.email = email;
        }

        const success = await userProfileProvider.updateUserProfile(
          username,
          updates
        );

        if (!success) {
          res.status(404).json({ error: "User profile not found" });
          return;
        }

        const updatedProfile = await userProfileProvider.getUserProfile(
          username
        );
        res.json(updatedProfile);
      } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update user profile" });
      }
    }
  );

  // Add friend
  app.post(
    "/api/profile/:username/friends",
    verifyAuthToken,
    async (req: Request, res: Response) => {
      try {
        const { username } = req.params;
        const { friendUsername } = req.body;

        // Users can only add friends to their own profile
        if (!req.user || req.user.username !== username) {
          res
            .status(403)
            .json({ error: "You can only modify your own friend list" });
          return;
        }
        if (!friendUsername) {
          res.status(400).json({ error: "Friend username is required" });
          return;
        }

        // Prevent users from adding themselves as friends
        if (friendUsername === username) {
          res
            .status(400)
            .json({ error: "You cannot add yourself as a friend" });
          return;
        }

        // Check if the friend exists
        const friendProfile = await userProfileProvider.getUserProfile(
          friendUsername
        );
        if (!friendProfile) {
          res.status(404).json({ error: "Friend user not found" });
          return;
        }

        const success = await userProfileProvider.addFriend(
          username,
          friendUsername
        );

        if (!success) {
          res
            .status(409)
            .json({ error: "Friend already exists or user not found" });
          return;
        }

        const updatedFriendsList = await userProfileProvider.getFriendsList(
          username
        );
        res.json({ friendList: updatedFriendsList });
      } catch (error) {
        console.error("Error adding friend:", error);
        res.status(500).json({ error: "Failed to add friend" });
      }
    }
  );

  // Remove friend
  app.delete(
    "/api/profile/:username/friends/:friendUsername",
    verifyAuthToken,
    async (req: Request, res: Response) => {
      try {
        const { username, friendUsername } = req.params;

        // Users can only remove friends from their own profile
        if (!req.user || req.user.username !== username) {
          res
            .status(403)
            .json({ error: "You can only modify your own friend list" });
          return;
        }

        const success = await userProfileProvider.removeFriend(
          username,
          friendUsername
        );

        if (!success) {
          res
            .status(404)
            .json({ error: "Friend not found in your friend list" });
          return;
        }

        const updatedFriendsList = await userProfileProvider.getFriendsList(
          username
        );
        res.json({ friendList: updatedFriendsList });
      } catch (error) {
        console.error("Error removing friend:", error);
        res.status(500).json({ error: "Failed to remove friend" });
      }
    }
  );

  // Get friends list
  app.get(
    "/api/profile/:username/friends",
    verifyAuthToken,
    async (req: Request, res: Response) => {
      try {
        const { username } = req.params;

        const friendsList = await userProfileProvider.getFriendsList(username);
        res.json({ friendList: friendsList });
      } catch (error) {
        console.error("Error retrieving friends list:", error);
        res.status(500).json({ error: "Failed to retrieve friends list" });
      }
    }
  );

  // Initialize or update user profile with environment data
  app.post(
    "/api/profile/:username/initialize",
    verifyAuthToken,
    async (req: Request, res: Response) => {
      try {
        const { username } = req.params;
        const { email, friendList } = req.body;

        // Users can only initialize their own profile
        if (!req.user || req.user.username !== username) {
          res
            .status(403)
            .json({ error: "You can only initialize your own profile" });
          return;
        }

        // Check if profile already exists
        const existingProfile = await userProfileProvider.getUserProfile(
          username
        );

        if (!existingProfile) {
          // Create new profile with provided data
          const newProfile = await userProfileProvider.createUserProfile(
            username,
            email || ""
          );

          // Add friends if provided
          if (friendList && Array.isArray(friendList)) {
            for (const friendUsername of friendList) {
              await userProfileProvider.addFriend(username, friendUsername);
            }
          }

          res.status(201).json(newProfile);
        } else {
          // Update existing profile
          const updates: any = {};
          if (email !== undefined) {
            updates.email = email;
          }

          await userProfileProvider.updateUserProfile(username, updates);

          // Add friends if provided and not already in list
          if (friendList && Array.isArray(friendList)) {
            for (const friendUsername of friendList) {
              if (!existingProfile.friendList.includes(friendUsername)) {
                await userProfileProvider.addFriend(username, friendUsername);
              }
            }
          }

          const updatedProfile = await userProfileProvider.getUserProfile(
            username
          );
          res.json(updatedProfile);
        }
      } catch (error) {
        console.error("Error initializing user profile:", error);
        res.status(500).json({ error: "Failed to initialize user profile" });
      }
    }
  );
}

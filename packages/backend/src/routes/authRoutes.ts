import { Express, Request, Response } from "express";
import { CredentialsProvider } from "../providers/CredentialsProvider";
import { UserProfileProvider } from "../providers/UserProfileProvider";
import jwt from "jsonwebtoken";

export interface IAuthTokenPayload {
  username: string;
}

function generateAuthToken(
  username: string,
  jwtSecret: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const payload: IAuthTokenPayload = {
      username,
    };
    jwt.sign(payload, jwtSecret, { expiresIn: "1d" }, (error, token) => {
      if (error) reject(error);
      else resolve(token as string);
    });
  });
}

export function registerAuthRoutes(
  app: Express,
  credentialsProvider: CredentialsProvider,
  userProfileProvider: UserProfileProvider
) {
  // Route to handle user registration
  app.post("/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, password, email } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      const success = await credentialsProvider.registerUser(
        username,
        password
      );

      if (success) {
        // Create user profile after successful registration
        await userProfileProvider.createUserProfile(username, email);
        res.status(201).json({ message: "User registered successfully" });
      } else {
        res
          .status(409)
          .json({ error: "User with this username already exists" });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Route to handle user login
  app.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      // HTTP 400 for missing username or password
      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      // Verify the password
      const isValid = await credentialsProvider.verifyPassword(
        username,
        password
      );

      // HTTP 401 for bad username or password
      if (!isValid) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
      }

      // Generate JWT token
      const token = await generateAuthToken(
        username,
        req.app.locals.JWT_SECRET
      );

      res.json({
        message: "Login successful",
        token: token,
        username: username,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Test route to verify password functionality
  app.post("/auth/verify", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      const isValid = await credentialsProvider.verifyPassword(
        username,
        password
      );

      res.json({
        username: username,
        passwordValid: isValid,
        message: isValid
          ? "Password is correct"
          : "Invalid username or password",
      });
    } catch (error) {
      console.error("Error verifying password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

import { Express, Request, Response } from "express";
import { CredentialsProvider } from "../providers/CredentialsProvider";

export function registerAuthRoutes(
  app: Express,
  credentialsProvider: CredentialsProvider
) {
  // Route to handle user registration
  app.post("/auth/register", async (req: Request, res: Response) => {
    console.log("Received registration request:", req.body);
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      const success = await credentialsProvider.registerUser(
        username,
        password
      );

      if (success) {
        res.status(201).json({ message: "User registered successfully" });
      } else {
        res.status(409).json({ error: "User already exists" });
      }
    } catch (error) {
      console.error("Error registering user:", error);
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

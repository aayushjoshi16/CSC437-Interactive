import { Express, Request, Response } from "express";

// Mock image data - in a real app, this would come from a database
const images = [
  {
    id: "1",
    name: "sunset.jpg",
    owner: "testuser",
    url: "/uploads/sunset.jpg",
  },
  {
    id: "2",
    name: "mountains.jpg",
    owner: "testuser",
    url: "/uploads/mountains.jpg",
  },
  {
    id: "3",
    name: "ocean.jpg",
    owner: "anotheruser",
    url: "/uploads/ocean.jpg",
  },
];

export function registerImageRoutes(app: Express) {
  // API for getting images - respond with data for authenticated requests and 401 otherwise
  app.get("/api/images", async (req: Request, res: Response) => {
    try {
      // Authentication is already verified by middleware
      const userImages = images.filter(
        (image) => image.owner === req.user?.username
      );
      res.json(userImages);
    } catch (error) {
      console.error("Error retrieving images:", error);
      res.status(500).json({ error: "Failed to retrieve images" });
    }
  });

  // API for modifying image names - respond with 204 No Content with authenticated requests,
  // 401 for unauthenticated requests, and 403 for unauthorized requests
  app.put("/api/images/:id/name", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      // Find the image
      const imageIndex = images.findIndex((img) => img.id === id);
      if (imageIndex === -1) {
        res.status(404).json({ error: "Image not found" });
        return;
      }

      const image = images[imageIndex];

      // Check if the user owns this image (403 for unauthorized)
      if (image.owner !== req.user?.username) {
        res
          .status(403)
          .json({ error: "You are not authorized to modify this image" });
        return;
      }

      // Update the image name
      images[imageIndex].name = name;

      // Return 204 No Content for successful modification
      res.status(204).end();
    } catch (error) {
      console.error("Error modifying image name:", error);
      res.status(500).json({ error: "Failed to modify image name" });
    }
  });
}

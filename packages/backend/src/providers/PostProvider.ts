import { Collection, MongoClient, ObjectId } from "mongodb";

interface PostDocument {
  _id?: ObjectId; // MongoDB ObjectId
  user: string; // Username of the user who created the post
  game: string; // Name of the game the post is about
  description: string; // Description of the post
  votes: string[]; // Array of usernames who have voted for the post
  timestamp: Date; // Timestamp of when the post was created
}

// Interface for pagination parameters
export interface PaginationOptions {
  page: number;
  limit: number;
  searchTerm?: string;
}

// Interface for pagination result
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PostProvider {
  private collection: Collection<PostDocument>;

  constructor(private readonly mongoClient: MongoClient) {
    const collectionName = process.env.POSTS_COLLECTION_NAME;
    if (!collectionName) {
      throw new Error(
        "Missing POSTS_COLLECTION_NAME from environment variables"
      );
    }
    this.collection = this.mongoClient.db().collection(collectionName);
  }

  // Original method to get all posts (keeping for backward compatibility)
  getAllPosts() {
    return this.collection.find().toArray();
  }

  // Updated method with pagination and search support
  async getPaginatedPosts(
    options: PaginationOptions & { searchTerm?: string }
  ): Promise<PaginatedResult<PostDocument>> {
    const { page = 1, limit = 10, searchTerm = "" } = options;
    const skip = (page - 1) * limit;

    // Build query filter based on search term if provided
    let filter = {};
    if (searchTerm && searchTerm.trim() !== "") {
      // Case-insensitive search for either username or game
      filter = {
        $or: [
          { user: { $regex: searchTerm, $options: "i" } },
          { game: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.collection
        .find(filter)
        .sort({ timestamp: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.collection.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get paginated posts for a specific user
  async getUserPaginatedPosts(
    username: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<PostDocument>> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    // Filter by the specified username
    const filter = { user: username };

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.collection
        .find(filter)
        .sort({ timestamp: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.collection.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  createPost(post: Omit<PostDocument, "_id">) {
    return this.collection.insertOne(post as PostDocument); // Insert a new post document into the collection.
  }

  // Add a user's vote to a post
  async addVote(postId: string, username: string) {
    return this.collection.updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { votes: username } }
    );
  }

  // Remove a user's vote from a post
  async removeVote(postId: string, username: string) {
    return this.collection.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { votes: username } }
    );
  }

  // Get a single post by ID
  async getPostById(postId: string) {
    return this.collection.findOne({ _id: new ObjectId(postId) });
  }
}

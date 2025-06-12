import { Collection, MongoClient, ObjectId } from "mongodb";

interface PostDocument {
  _id?: ObjectId; // MongoDB ObjectId
  user: string; // Username of the user who created the post
  game: string; // Name of the game the post is about
  description: string; // Description of the post
  votes: string[]; // Array of usernames who have voted for the post
  timestamp: Date; // Timestamp of when the post was created
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
  }  getAllPosts() {
    return this.collection.find().toArray();  // Get all documents in the collection as an array.
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

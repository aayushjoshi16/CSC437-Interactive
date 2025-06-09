import { Collection, MongoClient } from "mongodb";

interface PostDocument {
  _id: string; // MongoDB ObjectId
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
  }
  getAllPosts() {
    return this.collection.find().toArray(); // Without any options, will by default get all documents in the collection as an array.
  }
}

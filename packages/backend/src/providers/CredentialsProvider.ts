import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
  username: string;
  password: string;
}

export class CredentialsProvider {
  private readonly collection: Collection<ICredentialsDocument>;

  constructor(mongoClient: MongoClient) {
    const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
    if (!COLLECTION_NAME) {
      throw new Error("Missing CREDS_COLLECTION_NAME from env file");
    }
    this.collection = mongoClient
      .db()
      .collection<ICredentialsDocument>(COLLECTION_NAME);
  }

  async registerUser(username: string, plaintextPassword: string) {
    // Check if username already exists in the database
    const existingUser = await this.collection.findOne({ username: username });
    if (existingUser) {
      return false; // User already exists
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

    // Create the user record in the database
    await this.collection.insertOne({
      username: username,
      password: hashedPassword, // Salt prepended automatically to the hash
    });

    return true;
  }

  async verifyPassword(username: string, plaintextPassword: string) {
    // Find the user in the database
    const user = await this.collection.findOne({ username: username });
    if (!user) {
      return false; // User doesn't exist
    }

    // Compare the plaintext password with the stored hash
    const isPasswordValid = await bcrypt.compare(
      plaintextPassword,
      user.password
    );
    return isPasswordValid;
  }
}

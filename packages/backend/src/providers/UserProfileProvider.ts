import { Collection, MongoClient } from "mongodb";

export interface IUserProfile {
  username: string;
  email: string;
  friendList: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IUserProfileDocument extends IUserProfile {
  _id?: string;
}

export class UserProfileProvider {
  private readonly collection: Collection<IUserProfileDocument>;

  constructor(mongoClient: MongoClient) {
    const COLLECTION_NAME = process.env.USERS_COLLECTION_NAME || "userProfiles";
    this.collection = mongoClient
      .db()
      .collection<IUserProfileDocument>(COLLECTION_NAME);
  }

  async createUserProfile(
    username: string,
    email?: string
  ): Promise<IUserProfile> {
    const userProfile: IUserProfile = {
      username,
      email: email || "",
      friendList: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.collection.insertOne(userProfile);
    return userProfile;
  }

  async getUserProfile(username: string): Promise<IUserProfile | null> {
    const profile = await this.collection.findOne({ username });
    if (!profile) return null;

    return {
      username: profile.username,
      email: profile.email,
      friendList: profile.friendList,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async updateUserProfile(
    username: string,
    updates: Partial<IUserProfile>
  ): Promise<boolean> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await this.collection.updateOne(
      { username },
      { $set: updateData }
    );

    return result.modifiedCount > 0;
  }
  async addFriend(username: string, friendUsername: string): Promise<boolean> {
    // Prevent users from adding themselves as friends
    if (username === friendUsername) {
      return false;
    }

    // Check if friend is already in the list
    const profile = await this.getUserProfile(username);
    if (!profile || profile.friendList.includes(friendUsername)) {
      return false;
    }

    const result = await this.collection.updateOne(
      { username },
      {
        $addToSet: { friendList: friendUsername },
        $set: { updatedAt: new Date() },
      }
    );

    return result.modifiedCount > 0;
  }

  async removeFriend(
    username: string,
    friendUsername: string
  ): Promise<boolean> {
    const result = await this.collection.updateOne(
      { username },
      {
        $pull: { friendList: friendUsername },
        $set: { updatedAt: new Date() },
      }
    );

    return result.modifiedCount > 0;
  }

  async getFriendsList(username: string): Promise<string[]> {
    const profile = await this.getUserProfile(username);
    return profile ? profile.friendList : [];
  }
}

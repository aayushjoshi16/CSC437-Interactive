import styles from "./Profile.module.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import PostEntry from "../Post/PostEntry";
import type { FrontendPost } from "../Home/Home";

// Interface for the API response format
interface ApiPost {
  _id: string;
  user: string;
  game: string;
  description: string;
  votes: string[];
  timestamp: Date;
}

// Interface for paginated data from the API
interface PaginatedResponse {
  data: ApiPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface for user profile
interface UserProfile {
  username: string;
  email: string;
  friendList: string[];
  createdAt: string;
  updatedAt: string;
}

function Profile() {
  const { username: currentUser, token } = useAuth();
  const { username: urlUsername } = useParams();
  const navigate = useNavigate();

  // Redirect to /profile if current user visits their own profile via /profile/<username>
  useEffect(() => {
    if (urlUsername && currentUser && urlUsername === currentUser) {
      navigate("/profile", { replace: true });
      return;
    }
  }, [urlUsername, currentUser, navigate]);

  // Determine which user's profile to display
  const profileUsername = urlUsername || currentUser;
  const isOwnProfile = !urlUsername || urlUsername === currentUser;

  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [newFriend, setNewFriend] = useState("");
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);

  // Posts state
  const [userPosts, setUserPosts] = useState<FrontendPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Pagination state for posts
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    if (!profileUsername || !token) {
      setProfileError("You must be logged in to view profiles");
      setIsLoadingProfile(false);
      return;
    }

    try {
      setIsLoadingProfile(true);
      setProfileError(null);

      const response = await fetch(`/api/profile/${profileUsername}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch profile: ${response.status} ${response.statusText}`
        );
      }

      const profile: UserProfile = await response.json();
      setUserProfile(profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setProfileError(errorMessage);
      console.error("Error fetching user profile:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Function to handle removing a friend
  const handleRemoveFriend = async (friendUsername: string) => {
    if (!currentUser || !token || !isOwnProfile) return;

    try {
      const response = await fetch(
        `/api/profile/${currentUser}/friends/${friendUsername}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "same-origin",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove friend");
      }

      const data = await response.json();
      setUserProfile((prev) =>
        prev ? { ...prev, friendList: data.friendList } : null
      );
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  // Function to handle adding a friend
  const handleAddFriend = async (friendUsername: string) => {
    if (!currentUser || !token || friendUsername.trim() === "" || !isOwnProfile)
      return;

    try {
      const response = await fetch(`/api/profile/${currentUser}/friends`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({ friendUsername }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add friend");
      }

      const data = await response.json();
      setUserProfile((prev) =>
        prev ? { ...prev, friendList: data.friendList } : null
      );
      setNewFriend("");
      setShowAddFriendForm(false);
    } catch (error) {
      console.error("Error adding friend:", error);
      alert(error instanceof Error ? error.message : "Failed to add friend");
    }
  };

  // Function to fetch user posts with pagination
  const fetchUserPosts = async (page = currentPage, limit = pageSize) => {
    if (!profileUsername || !token) {
      setPostsError("You must be logged in to view posts");
      setIsLoadingPosts(false);
      return;
    }

    try {
      setIsLoadingPosts(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `/api/posts/user/${profileUsername}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "same-origin",
          cache: "no-cache",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch posts: ${response.status} ${response.statusText}`
        );
      }
      const paginatedData: PaginatedResponse = await response.json();
      const transformedPosts: FrontendPost[] = paginatedData.data.map(
        (post) => ({
          id: post._id,
          requestUser: post.user,
          game: post.game,
          description: post.description,
          votes: post.votes.length,
          voted: post.votes.includes(currentUser || ""), // Check if current user has voted
          timestamp: new Date(post.timestamp),
        })
      );

      setUserPosts(transformedPosts);
      setTotalPages(paginatedData.totalPages);
      setTotalPosts(paginatedData.total);
      setCurrentPage(paginatedData.page);
      setPageSize(paginatedData.limit);
      setPostsError(null);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setPostsError("Failed to load posts. Please refresh the page.");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Fetch user profile and posts on component mount
  useEffect(() => {
    if (profileUsername) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [profileUsername, urlUsername, token]);

  // Function to handle page changes for posts
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchUserPosts(newPage, pageSize);

      // Scroll to posts section when changing pages
      const postsSection = document.getElementById("user-posts-section");
      if (postsSection) {
        postsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Function to handle voting
  const handleVote = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle vote: ${response.status}`);
      }

      const data = await response.json();

      // Update the post in the local state
      setUserPosts((prevPostArray) => {
        return prevPostArray.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              voted: data.voted,
              votes: data.voteCount,
            };
          }
          return post;
        });
      });
    } catch (error) {
      console.error("Error toggling vote:", error);
      alert("Failed to toggle vote. Please try again.");
    }
  };

  // Generate pagination controls
  const renderPaginationControls = () => {
    return (
      <div className={styles["pagination-controls"]}>
        <button
          className={styles["pagination-button"]}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          &laquo; First
        </button>
        <button
          className={styles["pagination-button"]}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; Previous
        </button>
        <span className={styles["pagination-info"]}>
          Page {currentPage} of {totalPages} ({totalPosts} posts)
        </span>
        <button
          className={styles["pagination-button"]}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &gt;
        </button>
        <button
          className={styles["pagination-button"]}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last &raquo;
        </button>
      </div>
    );
  };

  return (
    <main className={styles["main"]}>
      {" "}
      {/* Profile picture, username and email */}
      <div className={styles["profile-container"]}>
        <FaUserCircle className={styles["profile-pic"]} size={160} />
        <div className={styles["profile-info"]}>
          <p>Username: {profileUsername}</p>
          {isLoadingProfile ? (
            <p>Loading profile...</p>
          ) : profileError ? (
            <p style={{ color: "red" }}>Error: {profileError}</p>
          ) : userProfile ? (
            <p>Email: {userProfile.email || "Not set"}</p>
          ) : null}
        </div>
      </div>
      {/* Friends section */}
      <div className={styles.container}>
        <div className={styles["post-container"]}>
          {" "}
          <div className={styles["friends-header"]}>
            <h2 className={styles["h2"]}>
              {isOwnProfile ? "Friends" : `${profileUsername}'s Friends`}
            </h2>
            {isOwnProfile && (
              <div
                onClick={() => setShowAddFriendForm(!showAddFriendForm)}
                style={{ cursor: "pointer" }}
              >
                <CiCirclePlus size={25} />
              </div>
            )}
          </div>
          {isOwnProfile && showAddFriendForm && (
            <div className={styles["add-friend-form"]}>
              <input
                type="text"
                value={newFriend}
                onChange={(event) => setNewFriend(event.target.value)}
                placeholder="Enter friend's username"
              />
              <button onClick={() => handleAddFriend(newFriend)}>Add</button>
              <button onClick={() => setShowAddFriendForm(false)}>
                Cancel
              </button>
            </div>
          )}
          <div>
            {isLoadingProfile ? (
              <p>Loading friends...</p>
            ) : !userProfile || userProfile.friendList.length === 0 ? (
              <p>No friends</p>
            ) : (
              userProfile.friendList.map((friendUsername, index) => (
                <div key={index} className={styles["friend-entry"]}>
                  <p>{friendUsername}</p>{" "}
                  <div>
                    {isOwnProfile && (
                      <MdDelete
                        className={styles["friend-actions"]}
                        size={20}
                        onClick={() => handleRemoveFriend(friendUsername)}
                        style={{ cursor: "pointer" }}
                      />
                    )}{" "}
                    <Link to={`/profile/${friendUsername}`}>
                      <FiExternalLink
                        className={styles["friend-actions"]}
                        size={20}
                        style={{ cursor: "pointer" }}
                      />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Post section */}
        <div id="user-posts-section" className={styles["post-container"]}>
          <h2>{isOwnProfile ? "My Posts" : `${profileUsername}'s Posts`}</h2>
          {isLoadingPosts ? (
            <p>Loading posts...</p>
          ) : postsError ? (
            <div>
              <p>{postsError}</p>
              <button onClick={() => fetchUserPosts(currentPage, pageSize)}>
                Retry
              </button>
            </div>
          ) : userPosts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            <div>
              {userPosts.map((post) => (
                <PostEntry
                  key={post.id}
                  postInfo={post}
                  handleVote={() => handleVote(post.id)}
                />
              ))}

              {/* Pagination controls */}
              {totalPages > 1 && renderPaginationControls()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Profile;

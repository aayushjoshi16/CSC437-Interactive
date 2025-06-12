import styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
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

function Profile() {
  const { username, token } = useAuth();
  const [friends, setFriends] = useState([
    { username: "john190", id: 1 },
    { username: "anon65", id: 2 },
  ]);
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

  // Function to handle removing a friend
  const handleRemoveFriend = (friendId: number) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendId)
    );
  };

  // Function to handle adding a friend
  const handleAddFriend = (newFriend: string) => {
    if (newFriend.trim() === "") return;

    const newFriendObj = {
      username: newFriend,
      id: friends.length + 1,
    };
    setFriends((prevFriends) => [...prevFriends, newFriendObj]);
    setNewFriend("");
    setShowAddFriendForm(false);
  };

  // Function to fetch user posts with pagination
  const fetchUserPosts = async (page = currentPage, limit = pageSize) => {
    if (!username || !token) {
      setPostsError("You must be logged in to view your posts");
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
        `/api/posts/user/${username}?${params.toString()}`,
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
          voted: post.votes.includes(username || ""), // Check if current user has voted
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

  // Fetch user posts on component mount
  useEffect(() => {
    if (username) {
      fetchUserPosts();
    }
  }, [username, token]);

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
      {/* Profile picture, username and password */}
      <div className={styles["profile-container"]}>
        <img
          className={styles["profile-pic"]}
          src="/profile.png"
          alt="Profile"
        />

        <div className={styles["profile-info"]}>
          <p>Username: {username}</p>
          <p>Password: ******</p>
        </div>
      </div>

      {/* Friends section */}
      <div className={styles.container}>
        <div className={styles["post-container"]}>
          <div className={styles["friends-header"]}>
            <h2 className={styles["h2"]}>Friends</h2>
            <div
              onClick={() => setShowAddFriendForm(!showAddFriendForm)}
              style={{ cursor: "pointer" }}
            >
              <CiCirclePlus size={25} />
            </div>
          </div>

          {showAddFriendForm && (
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
            {friends.length === 0 ? (
              <p>No friends</p>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className={styles["friend-entry"]}>
                  <p>{friend.username}</p>
                  <div>
                    <img
                      className={styles["friend-actions"]}
                      src="/trash.png"
                      alt="Delete Friend"
                      onClick={() => handleRemoveFriend(friend.id)}
                    />
                    <Link to={`/friends/${friend.username}`}>
                      <img
                        className={styles["friend-actions"]}
                        src="/link.png"
                        alt="Visit Profile"
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
          <h2>My Posts</h2>
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

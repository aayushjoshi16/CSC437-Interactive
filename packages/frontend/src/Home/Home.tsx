import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PostEntry from "../Post/PostEntry";
import CreatePost from "../Post/CreatePost";
import { useAuth } from "../contexts/AuthContext";

// Interface for the API response format
interface ApiPost {
  _id: string;
  user: string;
  game: string;
  description: string;
  votes: string[];
  timestamp: Date;
}

// Interface for our frontend post format
export interface FrontendPost {
  id: string;
  requestUser: string;
  game: string;
  description: string;
  votes: number;
  voted: boolean;
  timestamp: Date;
}

function Home() {
  const { token, username } = useAuth();
  const [postArray, setPostArray] = useState<FrontendPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/posts", {
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
          `Failed to fetch posts: ${response.status} ${response.statusText}`
        );
      }

      const apiPosts: ApiPost[] = await response.json();
      const transformedPosts: FrontendPost[] = apiPosts.map((post) => ({
        id: post._id,
        requestUser: post.user,
        game: post.game,
        description: post.description,
        votes: post.votes.length,
        voted: post.votes.includes(username || ""), // Check if current user has voted
        timestamp: new Date(post.timestamp),
      }));

      setPostArray(transformedPosts);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
      setPostArray((prevPostArray) => {
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePost = async (postData: any) => {
    try {
      // Create the post object to send to the API
      const postToCreate = {
        user: username, // Use the actual logged-in username
        game: postData.game,
        description: postData.description,
      };

      // Send POST request to create the post
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postToCreate),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create post: ${response.status} ${response.statusText}`
        );
      }

      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
  };

  // Filter posts based on active search term (search both user and game)
  const filteredPosts = activeSearchTerm
    ? postArray.filter(
        (post) =>
          post.requestUser
            .toLowerCase()
            .includes(activeSearchTerm.toLowerCase()) ||
          post.game.toLowerCase().includes(activeSearchTerm.toLowerCase())
      )
    : postArray;

  return (
    <main className={styles["main"]}>
      <form className={styles["form"]} onSubmit={handleSearch}>
        {" "}
        <input
          type="search"
          placeholder="Search by Username or Game"
          className={styles["input"]}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit">
          <img
            className={styles["search-pic"]}
            src="./public/search.png"
            alt="Search"
          />
        </button>
        <button
          type="button"
          className={styles["create-post-button"]}
          onClick={handleOpenModal}
        >
          <img
            className={styles["search-pic"]}
            src="./public/add.png"
            alt="Create a post"
          />
        </button>
      </form>
      <CreatePost
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreatePost}
      />{" "}
      <div className={styles["post-container"]}>
        {isLoading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <div>
            <p>{error}</p>
            <button onClick={fetchPosts}>Retry</button>
          </div>
        ) : (
          filteredPosts.map((post, _) => (
            <PostEntry
              key={post.id}
              postInfo={post}
              handleVote={() => handleVote(post.id)}
            />
          ))
        )}
      </div>
    </main>
  );
}

export default Home;

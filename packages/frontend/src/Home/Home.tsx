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

// Interface for paginated data from the API
interface PaginatedResponse {
  data: ApiPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function Home() {
  const { token, username } = useAuth();
  const [postArray, setPostArray] = useState<FrontendPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);

  // Fetch posts from the API with pagination and search
  const fetchPosts = async (page = currentPage, limit = pageSize, search = searchTerm) => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }
      
      const response = await fetch(`/api/posts?${params.toString()}`, {
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

      const paginatedData: PaginatedResponse = await response.json();
      const transformedPosts: FrontendPost[] = paginatedData.data.map((post) => ({
        id: post._id,
        requestUser: post.user,
        game: post.game,
        description: post.description,
        votes: post.votes.length,
        voted: post.votes.includes(username || ""), // Check if current user has voted
        timestamp: new Date(post.timestamp),
      }));

      setPostArray(transformedPosts);
      setTotalPages(paginatedData.totalPages);
      setTotalPosts(paginatedData.total);
      setCurrentPage(paginatedData.page);
      setPageSize(paginatedData.limit);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, pageSize, searchTerm);
  }, []);

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchPosts(newPage, pageSize, searchTerm);

      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
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
   
      setCurrentPage(1);
      await fetchPosts(1, pageSize, searchTerm);

      // Close the modal
      handleCloseModal();
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

    // Reset to first page when searching
    setCurrentPage(1);
    fetchPosts(1, pageSize, searchTerm);
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
      <form className={styles["form"]} onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search by Username or Game"
          className={styles["input"]}
          value={searchTerm}
          onChange={handleSearchChange}
        />        <button type="submit">
          <img
            className={styles["search-pic"]}
            src="/search.png"
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
            src="/add.png"
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
          <p>Loading posts...</p>        ) : error ? (
          <div>
            <p>{error}</p>
            <button onClick={() => fetchPosts(currentPage, pageSize, searchTerm)}>Retry</button>
          </div>
        ) : postArray.length === 0 ? (
          <p>
            No posts found.{" "}
            {searchTerm
              ? "Try a different search term."
              : "Be the first to create a post!"}
          </p>
        ) : (
          postArray.map((post) => (
            <PostEntry
              key={post.id}
              postInfo={post}
              handleVote={() => handleVote(post.id)}
            />
          ))
        )}
      </div>

      {/* Pagination controls at the bottom */}
      {!isLoading && !error && totalPages > 1 && renderPaginationControls()}
    </main>
  );
}

export default Home;

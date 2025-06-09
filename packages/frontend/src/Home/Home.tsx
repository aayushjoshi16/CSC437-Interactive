import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PostEntry from "../Post/PostEntry";
import CreatePost from "../Post/CreatePost";

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
}

function Home() {
  const [postArray, setPostArray] = useState<FrontendPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/posts", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
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

        // Transform API posts to frontend format
        const transformedPosts: FrontendPost[] = apiPosts.map((post) => ({
          id: post._id,
          requestUser: post.user,
          game: post.game,
          description: post.description,
          votes: post.votes.length,
          voted: false,
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

    fetchPosts();
  }, []);

  // Function to handle voting
  const handleVote = (postId: string) => {
    setPostArray((prevPostArray) => {
      const postIndex = prevPostArray.findIndex((post) => post.id === postId);

      if (postIndex === -1) return prevPostArray;

      const newPostArray = [...prevPostArray];
      const post = newPostArray[postIndex];

      // User wants to vote yes
      if (!post.voted) {
        post.votes++;
        post.voted = true;
      }
      // User wants to remove vote
      else {
        post.votes--;
        post.voted = false;
      }

      return newPostArray;
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCreatePost = (postData: any) => {
    const newPost = {
      id: String(postArray.length),
      requestUser: "You",
      game: postData.game,
      description: postData.description,
      votes: 0,
      voted: false,
    };

    setPostArray([...postArray, newPost]);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Filter posts based on search term
  const filteredPosts = searchTerm
    ? postArray.filter((post) =>
        post.requestUser.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : postArray;

  return (
    <main className={styles["main"]}>
      <form className={styles["form"]} onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search by Username"
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
            {filteredPosts.map((post, _) => (
              <PostEntry
                key={post.id}
                postInfo={post}
                handleVote={() => handleVote(post.id)}
              />
            ))}
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

import { useState } from "react";
import styles from "./Home.module.css";
import PostEntry from "../Post/PostEntry";
import CreatePost from "../Post/CreatePost";

// Default posts
const DEFAULT_POSTS = [
  {
    id: 0,
    requestUser: "john190",
    game: "Rocket League",
    description:
      "Looking for players to join me in a match today from 3pm to 4pm!",
    votes: 4,
    voted: false,
  },
  {
    id: 1,
    requestUser: "anon65",
    game: "Call of Duty",
    description: "Is anyone available for a game on May 15th from 12pm to 3pm?",
    votes: 10,
    voted: false,
  },
  {
    id: 2,
    requestUser: "gamernerd",
    game: "Minecraft",
    description:
      "Looking for players to join me in a match today from 3pm to 4pm!",
    votes: 2,
    voted: false,
  },
];

function Home() {
  const [postArray, setPostArray] = useState(DEFAULT_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle voting
  const handleVote = (postIndex: number) => {
    // User wants to vote yes
    if (postArray[postIndex].voted === false) {
      setPostArray((prevPostArray) => {
        const newPostArray = [...prevPostArray];
        newPostArray[postIndex].votes++;
        newPostArray[postIndex].voted = true;
        return newPostArray;
      });
    }

    // User wants to remove their vote
    else {
      setPostArray((prevPostArray) => {
        const newPostArray = [...prevPostArray];
        newPostArray[postIndex].votes--;
        newPostArray[postIndex].voted = false;
        return newPostArray;
      });
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePost = (postData: any) => {
    const newPost = {
      id: postArray.length,
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
      />

      <div className={styles["post-container"]}>
        {filteredPosts.map((post, _) => {
          const originalIndex = postArray.findIndex((p) => p.id === post.id);
          return (
            <PostEntry
              key={post.id}
              postInfo={post}
              handleVote={() => handleVote(originalIndex)}
            />
          );
        })}
      </div>
    </main>
  );
}

export default Home;

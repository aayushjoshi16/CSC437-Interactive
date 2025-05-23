import { useState } from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import PostEntry from "../Post/PostEntry";

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
];


function Home() {
  const [postArray, setPostArray] = useState(DEFAULT_POSTS);

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

  return (
    <div>
      {/* Nav bar */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* Search bar */}
        <form>
          <input type="search" placeholder="Search" />
          <button type="submit">
            <img
              className="search-pic"
              src="./public/search.png"
              alt="Search"
            />
          </button>
          <a href="./post/index.html">
            <button type="button" className="create-post-button">
              <img
                className="search-pic"
                src="./public/add.png"
                alt="Create a post"
              />
            </button>
          </a>
        </form>

        {/* Post section */}
        <div className="post-container">
          {/* Example posts */}
          {postArray.map((post, _) => (
            <PostEntry
              key={post.id}
              postInfo={post}
              handleVote={handleVote}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;

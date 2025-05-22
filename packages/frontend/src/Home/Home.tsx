import "./Home.css";

function Home() {
  return (
    <div>
      {/* Nav bar */}
      <nav aria-label="navbar" className="navbar">
        <h1>GameBuddy</h1>
        <a href="./profile/index.html">
          <img
            className="profile-pic"
            src="./public/profile-pic.png"
            alt="Visit Profile"
          />
        </a>
      </nav>

      {/* Main content */}
      <main>
        {/* Search bar */}
        <form>
          <input type="search" placeholder="Search" />
          {/* <button type="submit-button">
          <img class="search-pic" src="./public/search.png" alt="Search" />
        </button> */}
          <a href="./post/index.html">
            {/* <button type="create-post-button">
            <img class="search-pic" src="./public/add.png" alt="Create a post" />
          </button> */}
          </a>
        </form>

        {/* Post section */}
        <div className="post-container">
          <div className="post">
            <p>By john190</p>
            <p>Rocket League</p>
            <p>
              Looking for players to join me in a match today from 3pm to 4pm!
            </p>
            <div className="response-container">
              <button>Yes</button>
              <button>No</button>
            </div>
          </div>

          <div className="post">
            <p>By anon65</p>
            <p>Call of Duty</p>
            <p>Is anyone available for a game on May 15th from 12pm to 3pm?</p>
            <div className="response-container">
              <button>Yes</button>
              <button>No</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;

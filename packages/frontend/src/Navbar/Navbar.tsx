import "./Navbar.css"

function Navbar() {
  return (
    <nav aria-label="navbar">
      <h1>GameBuddy</h1>
      <a href="./profile/index.html">
        <img
          className="profile-pic"
          src="./public/profile-pic.png"
          alt="Visit Profile"
        />
      </a>
    </nav>
  );
}

export default Navbar;

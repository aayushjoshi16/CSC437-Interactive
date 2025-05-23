import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useTheme } from "../ThemeContext";

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  const [topRightImage, setTopRightImage] = useState<string | null>(null);

  // set the toprightimage to the profile pic if were on home page
  // set it to home icon if were on any other page
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") {
      setTopRightImage("./public/profile-pic.png");
    } else {
      setTopRightImage("./public/home.png");
    }
  }, [window.location.pathname]);
  
  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <nav className={styles["nav"]} aria-label="navbar">
      <Link to={"/"} className={styles["h1"]}>GameBuddy</Link>
      <div className={styles["nav-controls"]}>
        <button 
          onClick={toggleDarkMode} 
          className={styles["mode-toggle"]}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <Link to="/profile">
          <img
            className={styles["profile-pic"]}
            src={topRightImage || "./public/home.png"}
            alt="Visit Profile"
          />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useTheme } from "../ThemeContext";

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [imageName, setImageName] = useState("profile.png");
  const [redirectPath, setRedirectPath] = useState("/profile");

  // Set the initial image based on the current path
  useEffect(() => {
    if (window.location.pathname === "/profile") {
      setImageName("home.png");
      setRedirectPath("/home");
    } else {
      setImageName("profile.png");
      setRedirectPath("/profile");
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

  // Handle image click to toggle between home and profile
  const handleImageClick = () => {
    if (window.location.pathname === "/profile") {
      window.location.href = "/home";
    } else {
      window.location.href = "/profile";
    }
  };

  return (
    <nav className={styles["nav"]} aria-label="navbar">
      <Link to={"/home"} className={styles["h1"]}>
        GameBuddy
      </Link>
      <div className={styles["nav-controls"]}>
        <button
          onClick={toggleDarkMode}
          className={styles["mode-toggle"]}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <Link to={redirectPath} className={styles["profile-link"]}>
          <img
            onClick={handleImageClick}
            className={styles["profile-pic"]}
            src={`../public/${imageName}`}
            alt={`Visit ${imageName === "home.png" ? "home" : "profile"} page`}
          />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

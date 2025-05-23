import { Link } from "react-router-dom";
import { useEffect } from "react";
import styles from "./Navbar.module.css";
import { useTheme } from "../ThemeContext";

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  
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
            src="./public/profile-pic.png"
            alt="Visit Profile"
          />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

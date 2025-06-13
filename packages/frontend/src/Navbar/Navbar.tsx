import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import styles from "./Navbar.module.css";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { IoHome } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout, username } = useAuth();

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <>
      <nav className={styles["nav"]} aria-label="navbar">
        <Link to={"/home"} className={styles["h1"]}>
          GameBuddy
        </Link>{" "}
        <span className={styles["welcome-message"]}>Welcome, {username}!</span>
        <div className={styles["nav-controls"]}>
          <button
            onClick={toggleDarkMode}
            className={styles["mode-toggle"]}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>{" "}
          <Link
            to="/home"
            className={styles["profile-link"]}
            title="Go to Home"
          >
            <IoHome className={styles["profile-pic"]} size={24} />
          </Link>
          <Link
            to="/profile"
            className={styles["profile-link"]}
            title="Go to Profile"
          >
            <FaUser className={styles["profile-pic"]} size={20} />
          </Link>
          <button
            onClick={logout}
            className={styles["logout-button"]}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;

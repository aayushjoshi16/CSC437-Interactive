import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useTheme } from "../ThemeContext";

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [imageName, setImageName] = useState("profile.png");
  const [redirectPath, setRedirectPath] = useState("/profile");
  const location = useLocation();
  // Set the initial image based on the current path
  useEffect(() => {
    if (location.pathname === "/profile") {
      setImageName("home.png");
      setRedirectPath("/home");
    } else {
      setImageName("profile.png");
      setRedirectPath("/profile");
    }
  }, [location.pathname]);

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
        </Link>
        <div className={styles["nav-controls"]}>
          <button
            onClick={toggleDarkMode}
            className={styles["mode-toggle"]}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <Link to={redirectPath} className={styles["profile-link"]}>
            <img
              className={styles["profile-pic"]}
              src={`../public/${imageName}`}
              alt={`Visit ${
                imageName === "home.png" ? "home" : "profile"
              } page`}
            />
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;

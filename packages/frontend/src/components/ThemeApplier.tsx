import { useEffect } from "react";
import { useTheme } from "../ThemeContext";

export function ThemeApplier() {
  const { darkMode } = useTheme();

  // Apply dark mode class to body whenever theme changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return null; // This component doesn't render anything
}

import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import Navbar from "./Navbar/Navbar";
import { ThemeProvider } from "./ThemeContext";
import Login from "./Login/Login";
import FriendProfile from "./Profile/FriendProfile";

function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends/:username" element={<FriendProfile />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

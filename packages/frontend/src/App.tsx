import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import Navbar from "./Navbar/Navbar";
import { ThemeProvider } from "./ThemeContext";
import Login from "./Login/Login";
import FriendProfile from "./Profile/FriendProfile";
import { ValidRoutes } from "@backend/shared/ValidRoutes";

function App() {
  // Log routes for debugging
  console.log("ValidRoutes:", ValidRoutes);
  return (
    <ThemeProvider>
      <Routes>
        {/* Login route outside the Navbar */}
        <Route path={ValidRoutes.LOGIN} element={<Login />} />

        {/* Routes with Navbar */}
        <Route path="/" element={<Navbar />}>
          {/* Root path renders Home */}
          <Route index element={<Home />} />

          {/* Other routes inside Navbar */}
          <Route path={ValidRoutes.HOME} element={<Home />} />
          <Route path={ValidRoutes.PROFILE} element={<Profile />} />
          <Route path={ValidRoutes.FRIENDS} element={<FriendProfile />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;

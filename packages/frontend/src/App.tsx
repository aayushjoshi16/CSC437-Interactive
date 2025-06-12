import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import Navbar from "./Navbar/Navbar";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, AuthRedirect } from "./components/ProtectedRoute";
import Login from "./Login/Login";
import Register from "./Login/Register";
import FriendProfile from "./Profile/FriendProfile";
import { ValidRoutes } from "@backend/shared/ValidRoutes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Login and Register routes outside the Navbar - redirect if already authenticated */}
          <Route
            path={ValidRoutes.LOGIN}
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path={ValidRoutes.REGISTER}
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />

          {/* Protected routes with Navbar */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
              </ProtectedRoute>
            }
          >
            {/* Root path renders Home */}
            <Route index element={<Home />} />

            {/* Other protected routes inside Navbar */}
            <Route path={ValidRoutes.HOME} element={<Home />} />
            <Route path={ValidRoutes.PROFILE} element={<Profile />} />
            <Route path={ValidRoutes.FRIENDS} element={<FriendProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

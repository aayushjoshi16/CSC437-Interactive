import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import Navbar from "./Navbar/Navbar";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, AuthRedirect } from "./components/ProtectedRoute";
import { ThemeApplier } from "./components/ThemeApplier";
import Login from "./Login/Login";
import Register from "./Login/Register";
import { ValidRoutes } from "@backend/shared/ValidRoutes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeApplier />
        <Routes>

          {/* Login and Register - redirect if already authenticated */}
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
            <Route path={ValidRoutes.PROFILE_USER} element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

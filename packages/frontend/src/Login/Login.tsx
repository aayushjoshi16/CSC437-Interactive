import { Link, useNavigate, useLocation } from "react-router-dom";
import { useActionState } from "react";
import styles from "./Login.module.css";
import { handleAuthRequest } from "../utils/authUtils";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [result, submitAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const authResult = await handleAuthRequest(
        "/auth/login",
        formData,
        false
      );

      if (authResult.success && authResult.token) {
        // Use the auth context to handle login
        login(authResult.token, authResult.username || "");

        // Redirect to intended page or home
        const from = location.state?.from?.pathname || "/home";
        navigate(from, { replace: true });
      }

      return authResult;
    },
    null
  );

  return (
    <main className={styles["login-container"]}>
      <h1>Login</h1>
      <form className={styles["login-form"]} action={submitAction}>
        <div className={styles["login-field"]}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            disabled={isPending}
          />
        </div>
        <div className={styles["login-field"]}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            disabled={isPending}
          />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>
        {result?.error && (
          <p style={{ color: "red" }} aria-live="polite">
            {result.error}
          </p>
        )}
      </form>
      <p>
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{ color: "#3083ff", textDecoration: "none" }}
        >
          Register here
        </Link>
      </p>
    </main>
  );
}

export default Login;

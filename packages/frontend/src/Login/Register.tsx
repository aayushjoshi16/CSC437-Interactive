import { Link, useNavigate } from "react-router-dom";
import { useActionState } from "react";
import styles from "./Login.module.css";
import { handleAuthRequest } from "../utils/authUtils";

function Register() {
  const navigate = useNavigate();

  const [result, submitAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const authResult = await handleAuthRequest(
        "/auth/register",
        formData,
        true
      );

      if (authResult.success) {
        // On successful registration, redirect to login
        navigate("/login");
      }

      return authResult;
    },
    null
  );

  return (
    <main className={styles["login-container"]}>
      <h1>Register</h1>
      <form className={styles["login-form"]} action={submitAction}>
        {result?.message && <p style={{ color: "green" }}>{result.message}</p>}
        {result?.error && (
          <p style={{ color: "red" }} aria-live="polite">
            {result.error}
          </p>
        )}

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
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" disabled={isPending} />
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
        <div className={styles["login-field"]}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            disabled={isPending}
          />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#3083ff", textDecoration: "none" }}>
          Login here
        </Link>
      </p>
    </main>
  );
}

export default Register;

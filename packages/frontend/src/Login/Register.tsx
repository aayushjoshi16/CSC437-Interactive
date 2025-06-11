import { Link } from "react-router-dom";
import styles from "./Login.module.css";

function Register() {
  return (
    <main className={styles["login-container"]}>
      <h1>Register</h1>
      <form className={styles["login-form"]} action="/register" method="POST">
        <div className={styles["login-field"]}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className={styles["login-field"]}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className={styles["login-field"]}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className={styles["login-field"]}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/home";
          }}
        >
          Register
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

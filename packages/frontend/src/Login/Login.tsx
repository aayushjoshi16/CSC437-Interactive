import styles from "./Login.module.css";

function Login() {
  return (
    <main className={styles["login-container"]}>
      <h1>Login</h1>
      <form className={styles["login-form"]} action="/login" method="POST">
        <div className={styles["login-field"]}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className={styles["login-field"]}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" onClick={(e) => {
          e.preventDefault();
          window.location.href = "/home";
        }}>Login</button>
      </form>
    </main>
  );
}

export default Login;

import styles from "./Profile.module.css";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <main className={styles["main"]}>
      {/* Profile picture, username and password */}
      <div className={styles["profile-container"]}>
        <img
          className={styles["profile-pic"]}
          src="../public/profile.png"
        />

        <div className={styles["profile-info"]}>
          <p>Username: myuser</p>
          <p>Password: ******</p>
        </div>
      </div>

      {/* Friends section */}
      <div className={styles.container}>
        <div className={styles["post-container"]}>
          <h2 className={styles["h2"]}>Friends</h2>
          <div className={styles["friend-entry"]}>
            <p>john190</p>
            <div>
              <img
                className={styles["friend-actions"]}
                src="../public/trash.png"
                alt="Delete Friend"
              />
              <a href="../friends/john190/index.html">
                <img
                  className={styles["friend-actions"]}
                  src="../public/link.png"
                  alt="Visit Profile"
                />
              </a>
            </div>
          </div>

          <div className={styles["friend-entry"]}>
            <p>anon65</p>
            <div>
              <img
                className={styles["friend-actions"]}
                src="../public/trash.png"
                alt="Delete Friend"
              />
              <a href="../friends/anon65/index.html">
                <img
                  className={styles["friend-actions"]}
                  src="../public/link.png"
                  alt="Visit Profile"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Post section */}
        <div className={styles["post-container"]}>
          <h2>My Posts</h2>
          <p>
            None yet. Create one <Link to="/">here</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Profile;

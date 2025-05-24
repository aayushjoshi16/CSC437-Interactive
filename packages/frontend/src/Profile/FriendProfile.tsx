import styles from "./Profile.module.css";
import { Link } from "react-router-dom";

/* Currently this file is static
 * Soon as I integrate the backend, I will fetch the data from the server
 * and display it here
 *
 * Possibly, I will reuse existing Profile.tsx file to display user and friends' profiles
 */

function FriendProfile() {
  return (
    <main>
      <div className={styles["profile-container"]}>
        <img className={styles["profile-pic"]} src="../public/profile.png" />
        <div className={styles["profile-info"]}>
          <p>Username: anon65</p>
        </div>
      </div>

      <div className={styles["container"]}>
        <div className={styles["post-container"]}>
          <h2>Friends</h2>
          <div className={styles["friend-entry"]}>
            <p>john190</p>
            <div>
              <Link to="/friends/john190">
                <img
                  className={styles["friend-actions"]}
                  src="../../public/link.png"
                  alt="Visit User"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className={styles["post-container"]}>
          <h2>Posts</h2>
          <div className={styles["post"]}>
            <p>By anon65</p>
            <p>Call of Duty</p>
            <p>Is anyone available for a game on May 15th from 12pm to 3pm?</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FriendProfile;

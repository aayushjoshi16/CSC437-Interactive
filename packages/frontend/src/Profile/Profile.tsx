import styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";

function Profile() {
  const [friends, setFriends] = useState([
    { username: "john190", id: 1 },
    { username: "anon65", id: 2 },
  ]);
  const [newFriend, setNewFriend] = useState("");
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);

  // Function to handle removing a friend
  const handleRemoveFriend = (friendId: number) => {
    setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
  };

  // Function to handle adding a friend
  const handleAddFriend = (newFriend: string) => {
    if (newFriend.trim() === "") return;
    
    const newFriendObj = {
      username: newFriend,
      id: friends.length + 1,
    };
    setFriends((prevFriends) => [...prevFriends, newFriendObj]);
    setNewFriend("");
    setShowAddFriendForm(false);
  };

  // Function to handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFriend(event.target.value);
  }

  return (
    <main className={styles["main"]}>
      {/* Profile picture, username and password */}
      <div className={styles["profile-container"]}>
        <img className={styles["profile-pic"]} src="../public/profile.png" />

        <div className={styles["profile-info"]}>
          <p>Username: myuser</p>
          <p>Password: ******</p>
        </div>
      </div>

      {/* Friends section */}
      <div className={styles.container}>
        <div className={styles["post-container"]}>
          <div className={styles["friends-header"]}>
            <h2 className={styles["h2"]}>Friends</h2>
            <div 
              onClick={() => setShowAddFriendForm(!showAddFriendForm)} 
              style={{ cursor: 'pointer' }}
            >
              <CiCirclePlus size={25} />
            </div>
          </div>

          {showAddFriendForm && (
            <div className={styles["add-friend-form"]}>
              <input 
                type="text"
                value={newFriend}
                onChange={handleInputChange}
                placeholder="Enter friend's username"
              />
              <button onClick={() => handleAddFriend(newFriend)}>Add</button>
              <button onClick={() => setShowAddFriendForm(false)}>Cancel</button>
            </div>
          )}

          <div>
            {friends.length === 0 ? (
              <p>No friends</p>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className={styles["friend-entry"]}>
                  <p>{friend.username}</p>
                  <div>
                    <img
                      className={styles["friend-actions"]}
                      src="../public/trash.png"
                      alt="Delete Friend"
                      onClick={() => handleRemoveFriend(friend.id)}
                    />
                    <Link to={`/friends/${friend.username}`}>
                      <img
                        className={styles["friend-actions"]}
                        src="../public/link.png"
                        alt="Visit Profile"
                      />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Post section */}
        <div className={styles["post-container"]}>
          <h2>My Posts</h2>
          <p>No posts yet</p>
        </div>
      </div>
    </main>
  );
}

export default Profile;

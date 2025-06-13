import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "./Post.module.css";
import type { FrontendPost } from "../Home/Home";

// PostEntryProps interface
interface PostEntryProps {
  postInfo: FrontendPost;
  handleVote: () => Promise<void>;
}

// Function to format timestamp for display
const formatTimestamp = (timestamp: Date): string => {
  if (
    !timestamp ||
    !(timestamp instanceof Date) ||
    isNaN(timestamp.getTime())
  ) {
    return "Unknown date";
  }

  return timestamp.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function PostEntry({ postInfo, handleVote }: PostEntryProps) {
  return (
    <div className={styles.post}>
      <p>
        By{" "}
        <Link to={`/profile/${postInfo.requestUser}`}>
          {postInfo.requestUser}
        </Link>
      </p>
      <p>Posted at {formatTimestamp(postInfo.timestamp)}</p>
      <p>{postInfo.game}</p>
      <p>{postInfo.description}</p>
      <div className={styles["response-container"]}>
        {postInfo.votes}
        <button onClick={handleVote}>
          {postInfo.voted ? (
            <AiFillLike size={20} />
          ) : (
            <AiOutlineLike size={20} />
          )}
        </button>
      </div>
    </div>
  );
}

export default PostEntry;

import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import styles from "./Post.module.css";
import type { FrontendPost } from "../Home/Home"

// PostEntryProps interface
interface PostEntryProps {
  postInfo: FrontendPost;
  handleVote: () => void;
}

function PostEntry({ postInfo, handleVote }: PostEntryProps) {
  return (
    <div className={styles["post"]}>
      <p>By {postInfo.requestUser}</p>
      <p>{postInfo.game}</p>
      <p>{postInfo.description}</p>{" "}
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

import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import "./Post.css";

// PostInfo interface
interface PostInfo {
  id: number;
  requestUser: string;
  game: string;
  description: string;
  votes: number;
  voted: boolean;
}

// PostEntryProps interface
interface PostEntryProps {
  postInfo: PostInfo;
  handleVote: (postIndex: number) => void;
}

function PostEntry({ postInfo, handleVote }: PostEntryProps) {
  return (
    <div className="post">
      <p>By {postInfo.requestUser}</p>
      <p>{postInfo.game}</p>
      <p>{postInfo.description}</p>
      <div className="response-container">
        {postInfo.votes}
        <button onClick={() => handleVote(postInfo.id)}>
          {postInfo.voted ? <AiFillLike size={20} /> : <AiOutlineLike size={20}/>}
        </button>
      </div>
    </div>
  );
}

export default PostEntry;

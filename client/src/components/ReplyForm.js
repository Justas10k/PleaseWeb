import React, { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';


const ReplyForm = ({ postId, commentId, onAddReply }) => {
  const [reply, setReply] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting reply for postId:", postId, "commentId:", commentId);
    try {
      const response = await axiosPrivate.post(
        `/posts/${postId}/comment/${commentId}/reply`,
        {
          userId: auth.userId,
          username: auth.user,
          text: reply,
        }
      );
      console.log("Reply added:", response.data);
      onAddReply(postId, commentId, response.data); // Use the response data directly

      setReply("");
    } catch (err) {
      console.error("Error adding reply:", err);
      if (err.response?.status === 403) {
        console.error("Error adding reply wtf:", err);
        navigate('/login', { replace: true });
      }
    }
  };
/*  console.log("postId:", postId, "commentId:", commentId); */

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        required
      />
      <button type="submit">Add Reply</button>
    </form>
  );
};

export default ReplyForm;

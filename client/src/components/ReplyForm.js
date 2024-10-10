import React, { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';

const ReplyForm = ({ postId, commentId, onAddReply }) => {
  const [reply, setReply] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        `/posts/${postId}/comment/${commentId}/reply`,
        {
          userId: auth.userId,
          username: auth.user,
          text: reply,
        }
      );
      /* console.log("Reply added:", response.data); */
      onAddReply(postId, commentId, {
        userId: auth.userId,
        username: auth.user,
        text: reply,
        createdAt: new Date(),
      });

      setReply("");
    } catch (err) {
      console.error("Error adding reply:", err);
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

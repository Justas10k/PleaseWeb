import React, { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CommentForm = ({ postId, onAddComment }) => {
  const [comment, setComment] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting comment for postId:", postId);
    try {
      const response = await axiosPrivate.post(`/posts/${postId}/comment`, {
        userId: auth.userId,
        username: auth.user,
        text: comment,
        
      });
       console.log("Comment added:", response.data);
      onAddComment(postId, response.data); // Use the response data to ensure the comment ID is included
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      if (err.response?.status === 403) {
        console.error("Error adding comment wtf:", err);
        navigate('/login', { replace: true });
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default CommentForm;
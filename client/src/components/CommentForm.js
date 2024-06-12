import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const CommentForm = ({ postId, onAddComment }) => {
    const [comment, setComment] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.post(`/posts/${postId}/comment`, { comment });
            console.log('Comment added:', response.data);
            onAddComment(postId, { text: comment, createdAt: new Date() }); // Add the new comment to the state
            setComment(''); // Clear the comment input after submission
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />
            <button type="submit">Add Comment</button>
        </form>
    );
};

export default CommentForm;

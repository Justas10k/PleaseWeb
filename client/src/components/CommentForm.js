import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const CommentForm = ({ postId, onAddComment }) => {
    const [comment, setComment] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.post(`/posts/${postId}/comment`, {
                userId: "userId", // replace with actual userId
                username: "username", // replace with actual username
                text: comment
            });
            console.log('Comment added:', response.data);
            onAddComment(postId, {
                userId: "userId",
                username: "username",
                text: comment,
                createdAt: new Date(),
                replies: []
            });
            setComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
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

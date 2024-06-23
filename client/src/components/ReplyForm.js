import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ReplyForm = ({ postId, commentId, onAddReply }) => {
    const [reply, setReply] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.post(`/posts/${postId}/comment/${commentId}/reply`, {
                userId: "userId", // replace with actual userId
                username: "username", // replace with actual username
                text: reply
            });
            console.log('Reply added:', response.data);
            onAddReply(postId, commentId, { 
                userId: "userId", 
                username: "username", 
                text: reply, 
                createdAt: new Date() 
            });
            setReply('');
        } catch (err) {
            console.error('Error adding reply:', err);
        }
    };

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

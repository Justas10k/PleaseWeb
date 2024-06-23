import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const LikeButton = ({ postId, initialLikes, onLikeToggle }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialLikes.includes(postId));
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const handleLike = async () => {
        try {
            const response = await axiosPrivate.patch(`/posts/${postId}/like`, { userId: auth.userId });
            const updatedPost = response.data;

            setLikes(updatedPost.likes);
            setIsLiked(!isLiked);
            onLikeToggle(postId, updatedPost.likes);
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    return (
        <button onClick={handleLike}>
            {isLiked ? 'Unlike' : 'Like'} ({Object.keys(likes).length})
        </button>
    );
};

export default LikeButton;

import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/CreatePost.css';

const CreatePost = ({ addPostToFeed }) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userId = auth?.userId;
            if (!userId) {
                throw new Error('User ID is missing.');
            }

            const response = await axiosPrivate.post('/posts', {
                userId,
                description
            });

            // Handle the response and add the new post to the feed
            const newPost = response.data;
            addPostToFeed(newPost);

            setDescription('');
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                navigate('/login', { state: { from: location }, replace: true });
            } else {
                setError('Failed to create post. Please try again.');
            }
        }
    };

    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit}>
                <div className="post-input-section">
                    <div className="profile-pic">
                        <img src="your-profile-pic-url-here" alt="Profile" />
                    </div>
                    <input
                        type="text"
                        className="post-input"
                        placeholder="Start a post, try writing with AI"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="post-options">
                    <button type="button" className="option-button">
                        <img src="media-icon-url" alt="Media" />
                        <span>Media</span>
                    </button>
                    <button type="button" className="option-button">
                        <img src="event-icon-url" alt="Event" />
                        <span>Event</span>
                    </button>
                    <button type="button" className="option-button">
                        <img src="article-icon-url" alt="Write Article" />
                        <span>Write article</span>
                    </button>
                </div>
                <button type="submit" className="submit-post">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
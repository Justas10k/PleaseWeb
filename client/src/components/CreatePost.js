import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/CreatePost.css';
import ShowProfilePicture from './ShowProfilePicture';

const CreatePost = ({ addPostToFeed }) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [files, setFiles] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!description.trim()) {
            setError('Write something');
            return;
        }

        try {
            const userId = auth?.userId;
            if (!userId) {
                throw new Error('User ID is missing.');
            }

            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('description', description);
            files.forEach(file => {
                formData.append('media', file);
            });

            const response = await axiosPrivate.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle the response and add the new post to the feed
            const newPost = response.data;
            console.log('New post added:', newPost);
            addPostToFeed(newPost);

            setDescription('');
            setFiles([]);
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
                    <input 
                        type="file" 
                        name="media" 
                        multiple 
                        onChange={handleFileChange} 
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                
                <button type="submit" className="submit-post">Post</button>
            </form>
            <ShowProfilePicture/>
        </div>
    );
};

export default CreatePost;
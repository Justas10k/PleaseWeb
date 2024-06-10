import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const CreatePost = () => {
    const [description, setDescription] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = auth?.userId; // Ensure you have userId in your auth context
            if (!userId) {
                throw new Error('User ID is missing.');
            }
    
            const response = await axiosPrivate.post('/posts', {
                userId,
                description
            });
    
            setDescription('');
            navigate('/'); // Redirect to the homepage or posts feed
            
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
    };

    return (
        <div>
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;

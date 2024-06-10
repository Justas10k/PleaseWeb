import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null); // To store any error messages
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchPosts = async () => {
            try {
                const response = await axiosPrivate.get('/posts', {
                    signal: controller.signal
                });
                if (isMounted) {
                    setPosts(response.data);
                    setError(null); // Clear any previous errors
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching posts:', err);
                    setError('Failed to load posts. Please try again.');
                    if (err.response?.status === 403) {
                        navigate('/login', { state: { from: location }, replace: true });
                    }
                }
            }
        };

        if (auth?.accessToken) {
            fetchPosts();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [auth?.accessToken, axiosPrivate, navigate, location]);

    return (
        <div>
            <h2>Feed</h2>
            {error && <p className="error">{error}</p>}
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post._id} className="post">
                        <h3>{post.username}</h3>
                        <p>{post.description}</p>
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default Posts;

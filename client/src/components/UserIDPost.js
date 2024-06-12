import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const UserIDPost = () => {
    const { id } = useParams();
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState(null); // To store any error messages
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
        const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchUserPosts = async () => {
            try {
                const response = await axiosPrivate.get(`/posts/${id}/posts`, {
                    signal: controller.signal
                });
                if (isMounted) {
                    setUserPosts(response.data);
                    setError(null); // Clear any previous errors
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching user posts:', err);
                    setError('Failed to load user posts. Please try again.');
                     if (err.response?.status === 403) {
                         navigate('/login', { state: { from: location }, replace: true });
                     }
                }
            }
        };

        if (auth?.accessToken) {
            fetchUserPosts();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [auth?.accessToken, axiosPrivate, id]);

    return (
        <div>
            <h2>User Posts</h2>
            {error && <p className="error">{error}</p>}
            {userPosts.length > 0 ? (
                userPosts.map((post) => (
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

export default UserIDPost;

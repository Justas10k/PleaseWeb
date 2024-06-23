import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CommentForm from './CommentForm';
import ReplyForm from './ReplyForm';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
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
                    setError(null);
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

    const handleAddComment = (postId, newComment) => {
        setPosts(prevPosts => prevPosts.map(post =>
            post._id === postId ? { ...post, comments: [...post.comments, newComment] } : post
        ));
    };

    const handleAddReply = (postId, commentId, newReply) => {
        setPosts(prevPosts => prevPosts.map(post => 
            post._id === postId ? { 
                ...post, 
                comments: post.comments.map(comment => 
                    comment._id === commentId ? { ...comment, replies: [...comment.replies, newReply] } : comment
                ) 
            } : post
        ));
    };

    return (
        <div>
            <h2>Feed</h2>
            {error && <p className="error">{error}</p>}
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post._id} className="post">
                        <h3>{post.username}</h3>
                        <p>{post.description}</p>
                        {post.comments.map((comment) => (
                            <div key={comment._id} className="comment">
                                <strong>{comment.username}</strong>: {comment.text}
                                {comment.replies.map((reply) => (
                                    <div key={reply._id} className="reply">
                                        <strong>{reply.username}</strong>: {reply.text}
                                    </div>
                                ))}
                                <ReplyForm postId={post._id} commentId={comment._id} onAddReply={handleAddReply} />
                            </div>
                        ))}
                        <CommentForm postId={post._id} onAddComment={handleAddComment} />
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default Posts;

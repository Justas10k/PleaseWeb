import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CommentForm from './CommentForm';
import ReplyForm from './ReplyForm';
import CreatePost from './CreatePost'; // Import CreatePost component
import '../styles/Post.css';
import profilepicture from '../img/gimme2.jpg';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const [showComments, setShowComments] = useState({});
    const [showReplies, setShowReplies] = useState({});

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchPosts = async () => {
            try {
                const response = await axiosPrivate.get('/posts', {
                    signal: controller.signal
                });
                if (isMounted) {
                    setPosts(response.data.map(post => ({
                        ...post,
                        likes: post.likes || {}, // Ensure likes is an object
                        comments: post.comments.map(comment => ({
                            ...comment,
                            likes: comment.likes || {}, // Ensure likes is an object for each comment
                            replies: comment.replies.map(reply => ({
                                ...reply,
                                likes: reply.likes || {}, // Ensure likes is an object for each reply
                            })),
                        })),
                    })));
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

    // Add a new post to the feed
    const addPostToFeed = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    // Add a new comment to a post
    const handleAddComment = (postId, newComment) => {
        console.log(" new COMMMENT ::: postID :",postId, "newComment : ", newComment);
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId ? { 
                    ...post, 
                    comments: [...post.comments, { ...newComment, likes: {}, replies: [] }] 
                } : post
            )
        );
    };

    // Add a new reply to a comment
    const handleAddReply = (postId, commentId, newReply) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId ? {
                    ...post,
                    comments: post.comments.map(comment =>
                        comment._id === commentId ? { 
                            ...comment, 
                            replies: [...comment.replies, { ...newReply, likes: {} }] 
                        } : comment
                    )
                } : post
            )
        );
    };

    // Toggle like for a post
    const handleLikePost = async (postId) => {
        try {
            const response = await axiosPrivate.patch(`/posts/${postId}/like`, {
                userId: auth.userId,
            });
            setPosts(prevPosts => prevPosts.map(post =>
                post._id === postId ? response.data : post
            ));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    // Toggle like for a comment
    const handleLikeComment = async (postId, commentId) => {
        try {
            const response = await axiosPrivate.patch(`/posts/${postId}/comment/${commentId}/like`, {
                userId: auth.userId,
            });

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? {
                        ...post,
                        comments: post.comments.map(comment =>
                            comment._id === commentId ? {
                                ...comment,
                                likes: response.data.comments.find(c => c._id === commentId).likes 
                            } : comment
                        )
                    } : post
                )
            );
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    // Toggle like for a reply
    const handleLikeReply = async (postId, commentId, replyId) => {
        try {
            const response = await axiosPrivate.patch(`/posts/${postId}/comment/${commentId}/reply/${replyId}/like`, {
                userId: auth.userId,
            });

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? {
                        ...post,
                        comments: post.comments.map(comment =>
                            comment._id === commentId ? {
                                ...comment,
                                replies: comment.replies.map(reply =>
                                    reply._id === replyId ? { 
                                        ...reply, 
                                        likes: response.data.comments.find(c => c._id === commentId)
                                            .replies.find(r => r._id === replyId).likes 
                                    } : reply
                                )
                            } : comment
                        )
                    } : post
                )
            );
        } catch (err) {
            console.error('Error liking reply:', err);
        }
    };

    const toggleComments = (postId) => {
        setShowComments(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const toggleReplies = (commentId) => {
        setShowReplies(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    return (
        <div className='post-feed'>
            <h2>Feed</h2>
            <CreatePost addPostToFeed={addPostToFeed} /> {/* Include CreatePost component */}
            {error && <p className="error">{error}</p>}
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post._id} className="post">
                        <div className='post-mini-profile'><img src={profilepicture} className='profile-picture' alt='
                        '/><h3 className='post-username'>{post.username}</h3></div>
                        <p>{post.description}</p>
                        <button onClick={() => handleLikePost(post._id)}>
                            {post.likes?.hasOwnProperty(auth.userId) ? "Liked" : "Like"} ({Object.keys(post.likes || {}).length})
                        </button>
                        <button onClick={() => toggleComments(post._id)}>
                            {showComments[post._id] ? "Hide Comments" : "Show Comments"}
                        </button>
                        {showComments[post._id] && post.comments.map((comment) => (
                            <div key={comment._id} className="comment">
                                <strong>{comment.username}</strong>: {comment.text}
                                <button onClick={() => handleLikeComment(post._id, comment._id)}>
                                    {comment.likes?.hasOwnProperty(auth.userId) ? "Liked" : "Like"} ({Object.keys(comment.likes || {}).length})
                                </button>
                                <button onClick={() => toggleReplies(comment._id)}>
                                    {showReplies[comment._id] ? "Hide Replies" : "Show Replies"}
                                </button>
                                {showReplies[comment._id] && comment.replies.map((reply) => (
                                    <div key={reply._id} className="reply">
                                        <strong>{reply.username}</strong>: {reply.text}
                                        <button onClick={() => handleLikeReply(post._id, comment._id, reply._id)}>
                                            {reply.likes?.hasOwnProperty(auth.userId) ? "Liked" : "Like"} ({Object.keys(reply.likes || {}).length})
                                        </button>
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
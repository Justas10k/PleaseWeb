import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CommentForm from './CommentForm';
import ReplyForm from './ReplyForm';
import CreatePost from './CreatePost'; // Import CreatePost component
import ShowProfilePictureById from './ShowProfilePictureById'; // Import ShowProfilePictureById component
import '../styles/Post.css';

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
                        
                        likes: post.likes || {},
                        comments: post.comments.map(comment => ({
                            ...comment,
                            likes: comment.likes || {},
                            replies: comment.replies.map(reply => ({
                                ...reply,
                                likes: reply.likes || {},
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

    const addPostToFeed = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const handleAddComment = (postId, newComment) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId ? { 
                    ...post, 
                    comments: [...post.comments, { ...newComment, likes: {}, replies: [] }] 
                } : post
            )
        );
    };

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

    const handleDeletePost = async (postId) => {
        try {
            await axiosPrivate.delete(`/posts/${postId}`);
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await axiosPrivate.delete(`/posts/${postId}/comment/${commentId}`);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? {
                        ...post,
                        comments: post.comments.filter(comment => comment._id !== commentId)
                    } : post
                )
            );
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const handleDeleteReply = async (postId, commentId, replyId) => {
        try {
            await axiosPrivate.delete(`/posts/${postId}/comment/${commentId}/reply/${replyId}`);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? {
                        ...post,
                        comments: post.comments.map(comment =>
                            comment._id === commentId ? {
                                ...comment,
                                replies: comment.replies.filter(reply => reply._id !== replyId)
                            } : comment
                        )
                    } : post
                )
            );
        } catch (err) {
            console.error('Error deleting reply:', err);
        }
    };

    return (
        <div className='post-feed'>
            <h2>Feed</h2>
            <CreatePost addPostToFeed={addPostToFeed} />
            {error && <p className="error">{error}</p>}
            {posts.length > 0 ? (
                posts.map((post) => {
                    return (
                        <div key={post._id} className="post">
                            <div className='post-mini-profile-container'>
                                <ShowProfilePictureById userId={post.userId} />
                                <h3 className='post-username'>{post.username}</h3>
                            </div>
                            <p>{post.description}</p>
                            {post.media && post.media.map((mediaItem, index) => {
                                
                                console.log('MediaItem:', mediaItem);
                                /*console.log('Media type object:', mediaItem._doc);
                                console.log('Media type:', mediaItem._doc.type);
                                console.log('Media URL:', mediaItem.url);*/
                                return mediaItem._doc.type === 'image' ? (
                                    <img key={index} src={mediaItem.url} alt={`Post media ${index}`} className="post-image" />
                                ) : (

                                    <video key={index} controls className="post-video">
                                        <source src={mediaItem.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                );
                            })}
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
                                            {reply.userId === auth.userId && (
                                                <button onClick={() => handleDeleteReply(post._id, comment._id, reply._id)}>Delete Reply</button>
                                            )}
                                        </div>
                                    ))}
                                    {comment.userId === auth.userId && (
                                        <button onClick={() => handleDeleteComment(post._id, comment._id)}>Delete Comment</button>
                                    )}
                                    <ReplyForm postId={post._id} commentId={comment._id} onAddReply={handleAddReply} />
                                </div>
                            ))}
                            <CommentForm postId={post._id} onAddComment={handleAddComment} />
                            {post.userId === auth.userId && (
                                <button onClick={() => handleDeletePost(post._id)}>Delete Post</button>
                            )}
                        </div>
                    );
                })
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default Posts;

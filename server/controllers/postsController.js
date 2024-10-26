const Post = require("../model/Post");
const User = require("../model/User");

/* CREATE */
const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({
      userId,
      username: user.username,
      description,
    });
    await newPost.save();

    res.status(201).json(newPost); // Return the newly created post
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* READ */
const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ADD COMMENT */
const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { userId, username, text } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      userId,
      username,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Find the latest comment added to ensure it includes its ID
    const updatedPost = await Post.findById(id);
    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(200).json(addedComment); // Return the comment including its ID
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isLiked = comment.likes.get(userId);

    if (isLiked) {
      comment.likes.delete(userId);
    } else {
      comment.likes.set(userId, true);
    }

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ADD REPLY */
const addReply = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, username, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const newReply = {
      userId,
      username,
      text,
      createdAt: new Date(),
    };

    comment.replies.push(newReply);
    await post.save();

    // Find the latest reply added to ensure it includes its ID
    const updatedPost = await Post.findById(postId);
    const addedReply = updatedPost.comments.id(commentId).replies[updatedPost.comments.id(commentId).replies.length - 1];

    res.status(200).json(addedReply); // Return the reply including its ID
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likeReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const isLiked = reply.likes.get(userId);

    if (isLiked) {
      reply.likes.delete(userId);
    } else {
      reply.likes.set(userId, true);
    }

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.remove();
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.id(commentId).remove();
    await post.save();
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.id(replyId).remove();
    await post.save();
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  addComment,
  likeComment,
  addReply,
  likeReply,
  deletePost,
  deleteComment,
  deleteReply,
};

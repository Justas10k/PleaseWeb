const Post = require("../model/Post");
const User = require("../model/User");
//image start
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require('dotenv');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

function uploadFile(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
  };
  return s3Client.send(new PutObjectCommand(uploadParams));
}
function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };
  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  const command = new GetObjectCommand(params);
  const seconds = 60;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
  return url;
}
//image end
/* CREATE */
const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const media = []; // Initialize media array

    // Check if image files are provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageName = generateFileName(); // Generate a unique file name for the image

        const fileBuffer = await sharp(file.buffer)
          .resize({ height: 1920, width: 1080, fit: "contain" })
          .toBuffer();

        await uploadFile(fileBuffer, imageName, file.mimetype);

        // Add media object to the array
        media.push({
          name: imageName,
          type: file.mimetype.startsWith('image/') ? 'image' : 'video', // Determine type
          url: `https://${bucketName}.s3.${region}.amazonaws.com/${imageName}`, // Construct the media URL
        });
      }
    }

    // Create the new post object
    const newPost = new Post({
      userId,
      username: user.username,
      description,
      media, // Add media array to the post
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
    const imagesWithUrls = await Promise.all(posts.map(async (post) => {
      const mediaUrls = await Promise.all(post.media.map(async (mediaItem) => {
        console.log('before post:', mediaItem.name);
        const url = await getObjectSignedUrl(mediaItem.name); // Directly use the URL from the media item
        /*console.log('mediaItem::::', mediaItem);*/
        console.log('media URL::::', url)
        return {
          ...mediaItem,
           url, // Add the imageUrl field
        };
      }));
      return {
        ...post.toObject(),
        media: mediaUrls, // Include the media with URLs in the response
      };
    }));
   /* console.log('Posts with URLs:', imagesWithUrls);*/

    res.status(200).json(imagesWithUrls);
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

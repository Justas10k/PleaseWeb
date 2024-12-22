const express = require("express");
const postsController = require("../../controllers/postsController");
const verifyJWT = require("../../middleware/verifyJWT");
const multer = require('multer');

const router = express.Router();
const upload = multer().array('media');

/* CREATE */
router.post("/", verifyJWT, upload, postsController.createPost);

/* READ */
router.get("/", verifyJWT, postsController.getFeedPosts);
router.get("/:userId/posts", verifyJWT, postsController.getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyJWT, postsController.likePost);

/* LIKE COMMENT */
router.patch("/:postId/comment/:commentId/like", verifyJWT, postsController.likeComment);

/* ADD COMMENT */
router.post("/:id/comment", verifyJWT, postsController.addComment);

/* ADD REPLY */
router.post("/:postId/comment/:commentId/reply", verifyJWT, postsController.addReply);

router.patch("/:postId/comment/:commentId/reply/:replyId/like", verifyJWT, postsController.likeReply);

/* DELETE */
router.delete("/:id", verifyJWT, postsController.deletePost);
router.delete("/:postId/comment/:commentId", verifyJWT, postsController.deleteComment);
router.delete("/:postId/comment/:commentId/reply/:replyId", verifyJWT, postsController.deleteReply);

module.exports = router;

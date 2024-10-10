const express = require("express");
const postsController = require("../../controllers/postsController");
const verifyJWT = require("../../middleware/verifyJWT");

const router = express.Router();

/* CREATE */
router.post("/", verifyJWT, postsController.createPost);

/* READ */
router.get("/", verifyJWT, postsController.getFeedPosts);
router.get("/:userId/posts", verifyJWT, postsController.getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyJWT, postsController.likePost);

/* LIKE COMMENT */
router.patch("/:postId/comment/:commentId/like", verifyJWT, postsController.likeComment); // Add this line

/* ADD COMMENT */
router.post("/:id/comment", verifyJWT, postsController.addComment);

/* ADD REPLY */
router.post("/:postId/comment/:commentId/reply", verifyJWT, postsController.addReply);

router.patch("/:postId/comment/:commentId/reply/:replyId/like", verifyJWT, postsController.likeReply);

module.exports = router;

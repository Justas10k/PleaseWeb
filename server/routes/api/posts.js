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

module.exports = router;

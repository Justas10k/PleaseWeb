const express = require('express');
const imagesController = require('../../controllers/imagesController'); // Import the imagesController
const verifyJWT = require('../../middleware/verifyJWT'); // Import JWT verification middleware
const multer = require('multer'); // Import multer

const router = express.Router();
const upload = multer(); // Initialize multer

/* UPLOAD IMAGE */
router.post("/", verifyJWT, upload.single('image'), imagesController.uploadImage); // Use multer middleware here

/* GET IMAGES */
router.get("/", verifyJWT, imagesController.getImages); // Route for getting images

/* DELETE IMAGE */
router.delete("/:id", verifyJWT, imagesController.deleteImage); // Route for deleting an image

router.put("/:id", verifyJWT, upload.single('image'), imagesController.replaceImage);

/* UPLOAD VIDEO */
router.post("/uploadVideo", verifyJWT, upload.single('video'), imagesController.uploadVideo); // Use multer middleware for video uploads

/* GET VIDEOS */
router.get("/videos", verifyJWT, imagesController.getVideos); // Route for getting videos

/* DELETE VIDEO */
router.delete("/videos/:id", verifyJWT, imagesController.deleteVideo); // Route for deleting a video

router.put("/videos/:id", verifyJWT, upload.single('video'), imagesController.replaceVideo);

/* UPLOAD PROFILE PICTURE */
router.post("/profilePicture", verifyJWT, upload.single('profilePicture'), imagesController.uploadProfilePicture); // Use multer middleware for profile picture uploads

/* GET PROFILE PICTURE */
router.get("/profilePicture/:id", verifyJWT, imagesController.getProfilePicture); // Route for getting a user's profile picture

module.exports = router;
const express = require('express');
const router = express.Router();
const { handleImageUpload } = require('../../controllers/imagesController');

// Define the image upload route
router.post('/upload', handleImageUpload);

module.exports = router;
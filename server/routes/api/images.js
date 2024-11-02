const express = require('express');
const { imageRoutes } = require('../../controllers/imagesController.js');

const router = express.Router();

imageRoutes(router);

module.exports = router;
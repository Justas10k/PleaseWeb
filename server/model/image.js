const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Image model
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
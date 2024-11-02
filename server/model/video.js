const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Video model
const Video = mongoose.model('Video', videoSchema);

module.exports = Video; 
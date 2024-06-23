const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  likes: {
    type: Map,
    of: Boolean,
    default: {},
  },
  replies: [{
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    likes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  description: String,
  likes: {
    type: Map,
    of: Boolean,
    default: {},
  },
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

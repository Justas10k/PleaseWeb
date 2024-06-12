const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true
  },
  description: String,
  likes: {
    type: Map,
    of: Boolean,
    default: {},
  },
  comments: {
    type: Array,
    default: [],
  },
},   { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

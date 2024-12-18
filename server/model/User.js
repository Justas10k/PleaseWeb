const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    refreshToken: [String]
});

module.exports = mongoose.model('User', userSchema);
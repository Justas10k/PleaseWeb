const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUserById = async (req, res) => {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ "message": 'User ID required' });
    try {
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ 'message': `User ID ${userId} not found` });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).exec();
        if (!user) {
            return res.status(404).json({ 'message': 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getUserById,
    getProfile
}
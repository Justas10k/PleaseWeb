const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT');

// Routes requiring Admin role
router.route('/')
    .get(verifyJWT, verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyJWT, verifyRoles(ROLES_LIST.Admin), usersController.getUser);

// Route to get current user (accessible to all authenticated users)
router.route('/current-user')
    .get(verifyJWT, usersController.getCurrentUser);

module.exports = router;

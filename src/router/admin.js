const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.get('/', adminController.show);
//// currently for testing
// admin/users (can also do pagination)
router.get('/users', adminController.showUserList);

// admin/posts
router.get('/posts', adminController.showPostList);

// admin/users/details?id=XYZ
router.get('/users/details', adminController.showUserDetails);

// delete user
router.post('/users/details/delete', adminController.removeUser);
// update user
router.post('/users/details/update', adminController.editUser);

// admin/users/create
router.get('/users/create', adminController.showCreatePage);
router.post('/users/create', adminController.createUser);


module.exports = router;
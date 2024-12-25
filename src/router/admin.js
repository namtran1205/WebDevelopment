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

// admin/categories - main category page
router.get('/categories', adminController.showMainCategoryList);
router.post('/categories/delete', adminController.removeCategory);
router.get('/categories/exists', adminController.checkCategory); // .../exists?name=CATNAME
router.post('/categories/create', adminController.createCategory);

// admin/subcategories - subcategory page for a main category
router.get('/subcategories', adminController.showSubcategoryList) // subcategories?id=MAIN_CAT_ID

module.exports = router;
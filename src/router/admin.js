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
router.get('/subcategories', adminController.showSubcategoryList); // subcategories?id=MAIN_CAT_ID
router.post('/categories/update', adminController.editMainCategory);
router.post('/subcategories/delete', adminController.removeSubcategory);

// admin/tags
router.get('/tags', adminController.showTagList);
router.get('/tags/exists', adminController.checkTag); // .../exists?name=TAGNAME
router.post('/tags/create', adminController.createTag); // form: create new tag
router.post('/tags/delete', adminController.removeTag); // form: delete tag
router.get('/tags/details', adminController.showTagDetails); // tag details page; .../details?id=TAGID
router.post('/tags/update', adminController.changeTag); // form: change tag name
router.post('/tags/pull', adminController.dropTag); // form: remove a tag from post

// admin/posts
router.get('/posts', adminController.showPostList);
router.post('/posts/delete', adminController.removePost); // form: delete post
router.post('/posts/publish', adminController.approvePost); // form: publish post

module.exports = router;
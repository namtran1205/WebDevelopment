const express = require('express');
const writerController = require('../controller/writerController'); // Import controller
const router = express.Router();
const upload = require('../middleware/upload');

router.get('/', writerController.show); // Hiển thị trang dashboard
router.get('/createPost', writerController.show_createPost); // Hiển thị trang tạo bài viết
router.post('/createPost', writerController.post_createPost); // Xử lý tạo bài viết
router.get('/listPosts', writerController.show_listPosts); // Hiển thị trang danh sách bài viết
router.get('/post/:id', writerController.show_post); // Hiển thị trang bài viết
router.get('/edit/:id', writerController.show_editPost); // Hiển thị trang chỉnh sửa bài viết
router.post('/update/:id', writerController.post_updatePost); // Xử lý chỉnh sửa bài viết
router.delete('/delete/:id', writerController.deletePost); // Xử lý xóa bài viết


module.exports = router;

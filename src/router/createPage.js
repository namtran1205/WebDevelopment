// createPageRouter.js

const express = require('express');
const router = express.Router();
const createPageController = require('../controllers/createPageController');

// Route để hiển thị trang tạo bài viết
router.get('/create', createPageController.show);

// Route để xử lý đăng bài viết
router.post('/create', createPageController.post);

module.exports = router;

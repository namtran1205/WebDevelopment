const express = require('express');
const editorController = require('../controller/editorController'); // Import controller
const router = express.Router();

// router.get('/editor/drafts', editorController.show); // Hiển thị trang tạo bài viết
router.get('/editor/drafts', editorController.get);
router.get('/editor/draft/:id', editorController.detail);
router.post('/editor/draft/:id/approve', editorController.approve);
router.post('/editor/draft/:id/reject', editorController.reject);

module.exports = router;
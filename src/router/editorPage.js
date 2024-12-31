const express = require('express');
const editorController = require('../controller/editorController'); // Import controller
const router = express.Router();

// router.get('/editor/drafts', editorController.show); // Hiển thị trang tạo bài viết
router.get('/drafts', editorController.get);
router.get('/draft/:id', editorController.detail);
router.post('/draft/:id/approve', editorController.approve);
router.post('/draft/:id/reject', editorController.reject);
//router.post('/review', editorController.reviewDraft);

module.exports = router;
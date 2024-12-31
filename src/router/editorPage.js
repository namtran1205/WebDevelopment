const express = require('express');
const editorController = require('../controller/editorController'); // Import controller
const router = express.Router();

router.get('/', editorController.show); // Hiển thị trang tạo bài viết
router.get('/drafts', editorController.getDrafts);
router.get('/detail/:id', editorController.detail);
router.post('/draft/:id/approve', editorController.approve);
router.post('/draft/:id/reject', editorController.reject);
//router.post('/review', editorController.reviewDraft);

module.exports = router;
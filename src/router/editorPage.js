const express = require('express');
const editorController = require('../controller/editorController'); // Import controller
const router = express.Router();

router.get('/editor/confirm', editorController.show); // Hiển thị trang tạo bài viết
router.get('/editor/get', editorController.get);
router.post('/editor/approve/:id', editorController.update);
router.post('/editor/reject/:id', editorController.reject);
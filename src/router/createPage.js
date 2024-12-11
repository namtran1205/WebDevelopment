const express = require('express');
const createPageController = require('../controller/createPageController'); // Import controller
const router = express.Router();

router.get('/createPage', createPageController.show); // Hiển thị trang tạo bài viết

router.post('/createPage', createPageController.post);


//router.post('/createPage', authWriter, createPageController.post); // Xử lý tạo bài viết


// router.use(cors({
//     origin: 'localhost:8081'
// }));

module.exports = router;

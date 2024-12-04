const express = require('express');
const createPageController = require('../controller/createPageController'); // Import controller
const router = express.Router();
const authWriter = require('../middleware/authWriter');
// const multer = require('multer');
//const upload = multer();

//router.post('/createPage', upload.none(), createPageController.post);

router.get('/createPage', authWriter, createPageController.show); // Hiển thị trang tạo bài viết
router.post('/createPage', authWriter, createPageController.post); // Xử lý tạo bài viết


// router.use(cors({
//     origin: 'localhost:8081'
// }));

module.exports = router;

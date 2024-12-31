const express = require('express');
const router = express.Router();
const searchController = require('../controller/searchController'); // Đảm bảo đường dẫn đúng

router.get('/search', searchController.searchPosts); // Khai báo route tìm kiếm
console.log('router day');
module.exports = router;

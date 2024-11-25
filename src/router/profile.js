const express = require("express");
const router = express.Router();
const profileController = require("../controller/profileController");

// Route để render trang quản lý tài khoản
router.get("/",  profileController.show);

// Route để cập nhật thông tin tài khoản
router.post("/",  profileController.update);

module.exports = router;
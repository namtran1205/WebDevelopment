const express = require("express");
const router = express.Router();
const profileController = require("../controller/profileController");

router.post("/",  profileController.logout);

router.get("/profile/:userId",  profileController.show);

// Route để cập nhật thông tin tài khoản
router.post("/profile/:userId",  profileController.update);
module.exports = router;

router.post("/profile/:userId/changePassword",  profileController.changePassword);
module.exports = router;
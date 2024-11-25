const express = require("express");
const router = express.Router();
const detailPageController = require("../controller/detailPageController");


router.get("/", detailPageController.show);


module.exports = router;


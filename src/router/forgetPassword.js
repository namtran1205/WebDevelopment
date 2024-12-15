const express = require('express');
const router = express.Router()
const forgetPasswordController = require('../controller/forgetPassword');

router.get('/', forgetPasswordController.show);

router.post('/', forgetPasswordController.sendOTPEmail);

module.exports = router;
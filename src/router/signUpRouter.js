const express = require('express')
const router = express.Router()
const signUpController = require('../controller/signUpController')
const User = require("../models/User");

router.get('/', (req, res) => signUpController.show(req, res));

router.post('/', (req, res) => signUpController.createUser(req, res));

router.get('/verify', async (req, res) => {
    const { token } = req.query;
  
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send('Invalid or expired token');
    }
    
    user.verificationToken = null;
    user.isVerified = true;
    await user.save();
  
    res.send('Email verified successfully!');
});

module.exports = router;
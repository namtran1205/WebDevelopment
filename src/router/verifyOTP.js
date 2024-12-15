const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/api/v1/verify-otp', async (req, res)=>{
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).send("Email is required to verify OTP.");
      }
      res.render('verifyOTP', { email });
    } catch (error) {
        console.log("Error rendering verify OTP page:", error.message);
        res.status(500).send("Error rendering verify OTP page");
    }
});

// Verify OTP and Reset Password
router.post('/api/v1/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    // Verify OTP and expiration
    if (user.verificationOTP !== otp || new Date() > user.otpExpiresAt) {
      return res.status(400).send('Invalid or expired OTP.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear OTP fields
    user.password = hashedPassword;
    user.verificationOTP = null;
    user.otpExpiresAt = null;
    await user.save();

    res.send('Password has been reset successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error resetting password.');
  }
});


module.exports = router;
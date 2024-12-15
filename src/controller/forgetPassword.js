const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

class ForgetPasswordController {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'webdevelopment592@gmail.com',
                pass: 'nlgyfmbvqyvrqcbs',
            },
        });

        // Manually bind methods
        this.show = this.show.bind(this);
        this.sendOTPEmail = this.sendOTPEmail.bind(this);
        this.generateOTP = this.generateOTP.bind(this);
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async show(req, res) {
        try {
            res.render('forgetPassword');
        } catch (error) {
            console.error("Error rendering forget password page:", error.message);
            res.status(500).send("Error rendering forget password page");
        }
    }

    async sendOTPEmail(req, res) {
        const { email } = req.body;

        try {
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) return res.status(404).send('User not found');

            // Generate OTP and expiration time
            const otp = this.generateOTP(); // Correctly bound
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            // Save OTP to user document
            user.verificationOTP = otp;
            user.otpExpiresAt = otpExpiresAt;
            await user.save();

            // Send email with OTP
            const mailOptions = {
                from: '"Báo chí HCMUS" <webdevelopment592@gmail.com>',
                to: user.email,
                subject: 'Email OTP verification',
                html: `
                    <p>Dear ${user.fullName},</p>
                    <p>Your OTP for password reset is:</p>
                    <h2>${otp}</h2>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                `,
            };

            await this.transporter.sendMail(mailOptions);

            res.redirect(`/api/v1/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error("Error sending OTP:", error.message);
            res.status(500).send('Error sending OTP.');
        }
    }
}

module.exports = new ForgetPasswordController();

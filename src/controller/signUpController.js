const { render } = require('ejs');
const path = require('path');
const fs = require('fs');
const User = require("../models/User");
const insertUserService = require('../services/insertUser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

class signUpController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        // Web gmail
        user: 'webdevelopment592@gmail.com',
        pass: 'nlgyfmbvqyvrqcbs',
      },
    });

    this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  async show(req, res) {
    try {
      res.render('signUpPage');
    } catch (error) {
      console.error("Error rendering signup page:", error.message);
      res.status(500).send("Error rendering signup page.");
    }
  }

  async sendVerificationEmail(email, token) {
    // Email content
    const verificationUrl = `http://127.0.0.1:8080/api/v1/signup/verify?token=${token}`;
    const mailOptions = {
      from: '"Báo chí HCMUS" <webdevelopment592@gmail.com>',
      to: email,
      subject: 'Email Verification',
      html: `<p>Vui lòng nhấn vào đường link để xác thực email của bạn:</p>
             <a href="${verificationUrl}">Verify Email</a>`,
    };

    // Send the email
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error.message);
      throw new Error('Failed to send verification email');
    }
  }

  async createUser(req, res) {
    try {
      const { fullName, password, nickname, email, dateOfBirth, type } = req.body;
      const today = new Date();

      if (dateOfBirth > today) {
        return res.redirect(`/app/v1/signup?error=true&message=${encodeURIComponent("Ngày sinh không hợp lệ")}`)
      }

      let idCategory = "";
      
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      const newUser = new User({
        fullName,
        password,
        nickname: type === "writer" ? nickname : null,
        email,
        dateOfBirth,
        type,
        idCategory: type == "editor" ? idCategory: null,
        verificationToken
      });
      
      const { fail, result } = await insertUserService.insertUser(newUser);
      
      if (fail) {
        console.error(result);
        return res.redirect(`/api/v1/signup?error=true&message=${encodeURIComponent(result.message)}`);
      }
      
      // Use arrow function to automatically bind 'this' to the signUpController instance
      await this.sendVerificationEmail(email, verificationToken);
    
      return res.redirect('/api/v1/signup?success=true');
    } catch (error) {
      console.error("Error signing up user:", error.message);
  
      return res.redirect(`/api/v1/signup?error=true&message=${encodeURIComponent(error.message)}`);
    }
  }
}

module.exports = new signUpController();

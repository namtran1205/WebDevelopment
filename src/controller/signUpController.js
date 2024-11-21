const { render } = require('ejs');
const path = require('path');
const fs = require('fs');
const User = require("../models/User");

class signUpController {
  async show(req, res) {
    try {
      res.render('signUpPage');
    } catch (error) {
      console.error("Error rendering signup page:", error.message);
      res.status(500).send("Error rendering signup page.");
    }
  }

  async createUser(req, res) {
    try {
      const { fullName, nickname, email, dateOfBirth, type } = req.body;
  
      const newUser = new User({
        fullName,
        nickname: type === "writer" ? nickname : null,
        email,
        dateOfBirth,
        type,
      });
  
      await newUser.save();
  
      res.redirect('/api/v1/signup?success=true');
    } catch (error) {
      console.error("Error signing up user:", error.message);
  
      res.redirect(`/api/v1/signup?error=true&message=${encodeURIComponent(error.message)}`);
    }
  }
  
}

module.exports = new signUpController();

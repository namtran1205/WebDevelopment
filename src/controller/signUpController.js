const { render } = require('ejs');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
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
      const { fullName, password, nickname, email, dateOfBirth, type } = req.body;
      const today = new Date();

      console.log('Before comparing');
      if (dateOfBirth > today) {
        console.log('After comparing');
        return res.redirect(`/app/v1/signup?error=true&message=${encodeURIComponent("Ngày sinh không hợp lệ")}`)
      }
      let idCategory = "";
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, async function(err, hash) {
        if (err)
        {
          console.error(err);
          return res.redirect(`/api/v1/signup?error=true&message=${encodeURIComponent(error.message)}`);
        }

        const newUser = new User({
          fullName,
          password: hash,
          nickname: type === "writer" ? nickname : null,
          email,
          dateOfBirth,
          type,
          idCategory: type == "editor" ? idCategory: null
        });
        
        await newUser.save();

        return res.redirect('/api/v1/signup?success=true');
      });
  
    } catch (error) {
      console.error("Error signing up user:", error.message);
  
      return res.redirect(`/api/v1/signup?error=true&message=${encodeURIComponent(error.message)}`);
    }
  }
  
}

module.exports = new signUpController();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Configure the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'mail' }, // Specify that the 'mail' field should be used as the username
  async (mail, password, done) => {
    try {
      const user = await User.findOne({ email: mail, isVerified: true });
      if (!user) {
        return done(null, false, { message: 'Email không hợp lệ hoặc chưa được xác thực.' });
      }

      // Compare the password with the hashed one in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Sai mật khẩu.' });
      }

      // If everything is good, return the user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize the user to store the user ID in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;

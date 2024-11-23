const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: function () {
      return this.type === 'writer';
    },
    default: function() {
        if (this.type !== 'writer') {
            return null;
        }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['subscriber', 'writer', 'editor', 'admin'],
    required: true,
  },
  remainingTime: {
    type: Date,
    required: function () {
      return this.type === 'subscriber';
    },
    default: function () {
      if (this.type === 'subscriber') {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      }
      return null;
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

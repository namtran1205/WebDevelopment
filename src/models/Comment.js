const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  writer: {
    type: String,
    default: "Anonymous",
  },
  content: {
    type: String,
    required: true
  },
}, {
    timestamps: true
});

const Comment = mongoose.model('Post', CommentSchema);

module.exports = Comment;

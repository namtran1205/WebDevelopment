const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true,
    maxlength: 100
  },
  state: {
    type: String,
    enum: ['chưa được duyệt', 'bị từ chối'],
    default: 'chưa được duyệt'
  }
}, {
  timestamps: true
});

postSchema.pre('save', function(next) {
    if (this.content) {
      this.abstract = this.content.substring(0, 100);
    }
    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

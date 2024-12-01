const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
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
  category: {
    type: String,
    required: true,
  },
  tags: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    },
  ],

  state: {
    type: String,
    enum: ['Chưa được duyệt', 'Bị từ chối', 'Đã được duyệt và chờ xuất bản', 'Đã xuất bản'],
    default: 'Chưa được duyệt'
  },


  
  image: {
    type: String,
    required: true
  },
  
  publishedDate: {
    type: Date,
    default: null,
  },

  idWriter: {
    type: String,
    required: true
  },

  idCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCategory',
    required: true,
},

});

PostSchema.pre('save', function(next) {
    if (this.content) {
      this.abstract = this.content.substring(0, 100);
    }
    next();
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

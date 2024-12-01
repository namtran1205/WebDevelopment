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
  subCategory: {
    type: String,
    required: true,
  },
  tags: [

    {
        type: String,
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
    type: String,
    required: true,
  },

});

PostSchema.pre('save', function(next) {
    if (this.content) {
      this.abstract = this.content.substring(0, 100);
    }
    next();
});

PostSchema.post('save', async function (doc) {
  const MainCategory = mongoose.model('MainCategory');
  await MainCategory.findByIdAndUpdate(doc.idCategory, { $addToSet: { posts: doc._id } });
});

PostSchema.post('remove', async function (doc) {
  const MainCategory = mongoose.model('MainCategory');
  await MainCategory.findByIdAndUpdate(doc.idCategory, { $pull: { posts: doc._id } });
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

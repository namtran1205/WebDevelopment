const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { // yes
    type: String,
    required: true
  },
  content: { // no
    type: String,
    required: true
  },
  abstract: { // yes
    type: String,
    required: true,
    maxlength: 100
  },

  // For sub
  subCategory: { // yes
    type: String,
    default: null,
  },
  tags: [ // yes

    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],

  state: { // no
    type: String,
    enum: ['Chưa được duyệt', 'Bị từ chối', 'Đã được duyệt và chờ xuất bản', 'Đã xuất bản'],
    default: 'Chưa được duyệt'
  },

  reason: { // no
    type: String,
    default: null,
    required: false
  },

  
  image: { // yes
    type: String,
    required: true
  },
  
  publishedDate: { // yes
    type: Date,
    default: null,
  },

  view: { // no
    type: Number,
    require: true,
  },

  viewWeek: { type: Number, }, // no

  idWriter: { // no
    type: String,
    required: true
  },

  // For Main Category
  idMainCategory: { // yes
    type: String,
    default: null,
  },

  type: { // yes
    type: String,
    enum: ['normal', 'premium'],
    required: true,
  }

});

PostSchema.index({ state: -1 });

PostSchema.pre('save', function(next) {
    if (this.content) {
      this.abstract = this.abstract.substring(0, 100);
    }
    next();
});

PostSchema.post('save', async function (doc) {
  const MainCategory = mongoose.model('MainCategory');
  await MainCategory.findByIdAndUpdate(doc.idMainCategory, { $addToSet: { posts: doc._id } });
});

PostSchema.post('remove', async function (doc) {
  const MainCategory = mongoose.model('MainCategory');
  await MainCategory.findByIdAndUpdate(doc.idMainCategory, { $pull: { posts: doc._id } });
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

const Post = require('../models/Post'); 

// Controller xử lý tìm kiếm
exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q; // Nhận từ khóa từ URL (GET method)
    const results = await Post.find({ title: { $regex: query, $options: 'i' } }).select('title content') .lean();
    console.log(results);
    console.log('Xin chao');
    res.render('searchResults', { results, query }); // Render trang kết quả
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ!');
  }
  console.log('Từ khóa tìm kiếm:', req.query.q);
};

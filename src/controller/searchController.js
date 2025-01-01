const Post = require('../models/Post'); 

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q; 

    const results = await Post.find({
    $text: { $search: query },
    state: "Đã xuất bản"
    })
    .select('title abstract content image') 
    .lean();
    res.render('searchResults', { results, query }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ!');
  }
  console.log('Từ khóa tìm kiếm:', req.query.q);
};
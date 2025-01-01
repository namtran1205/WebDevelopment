const Post = require('../models/Post'); 

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q; 

    const results = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { abstract: { $regex: query, $options: 'i' } }
      ],
      state: "Đã xuất bản"
    })
    .select('title content abstract image')
    .lean();

    console.log(results);
    res.render('searchResults', { results, query }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ!');
  }
  console.log('Từ khóa tìm kiếm:', req.query.q);
};
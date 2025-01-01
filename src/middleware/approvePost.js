const Post = require('../models/Post');

// Hàm kiểm tra và cập nhật trạng thái bài viết
const checkAndUpdatePosts = async () => {
  const currentDate = new Date();

  try {
    // Log current date
    //console.log('Current Date:', currentDate);


    const result = await Post.updateMany(
      { 
        state: 'Đã được duyệt và chờ xuất bản', 
        publishedDate: { $lte: currentDate }
      },
      { $set: { state: 'Đã xuất bản' } }
    );

    //console.log(`Updated ${result.nModified || 0} posts to 'Đã xuất bản'.`);
  } catch (error) {
    console.error('Error checking and updating posts:', error);
  }
};

module.exports = checkAndUpdatePosts;
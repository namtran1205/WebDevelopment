const User = require('../models/User'); // Import model User

const authWriter = async (req, res, next) => {
  try {
    // Lấy thông tin người dùng từ session hoặc request
    if (!res.locals.user)
    {
      res.redirect('/login');
      return;
    }
    let user = res.locals.user
    let userId = user._id;

    if (!userId) {
      return res.status(401).json({ message: 'User ID is missing' });
    }

    // Tìm user trong database
    const users = await User.findById(userId);
    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra nếu user không phải là writer hay admin
    if (user.type !== 'writer' && user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Only writers are allowed' });
    }

    // Gắn idWriter vào request
    req.idWriter = userId;
    next(); // Tiếp tục xử lý yêu cầu
  } catch (err) {
    console.error('Error in authWriter middleware:', err);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = authWriter;

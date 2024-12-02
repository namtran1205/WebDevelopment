// createPageController.js

const PostSchema = require('../models/Post'); // Đảm bảo bạn import đúng model của bạn

class createPageController {
    async show(req, res) {
        try {
            res.render('createPage'); // Render trang tạo bài viết
        } catch (err) {
            console.error('Error rendering createPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang tạo bài viết');
        }
    }

    async post(req, res) {
        try {
            const { title, content, subCategory, mainCategory, idWriter, state } = req.body;
        
            // Validate required fields
            if (!title || !content || !subCategory || !mainCategory || !idWriter) {
              return res.status(400).json({ error: 'Missing required fields' });
            }
        
            // Create a new post
            const newPost = new PostSchema({
              title,
              content,
              abstract: content.substring(0, 100), // Automatically create abstract from content
              subCategory,
              mainCategory,
              state: state || 'Chưa được duyệt',
              idWriter,
            });
        
            // Save post to database
            const savedPost = await newPost.save();
            res.status(201).json(savedPost);
          } catch (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ error: 'Internal server error' });
          }
    }
}

module.exports = new createPageController();

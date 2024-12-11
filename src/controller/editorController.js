const PostSchema = require('../models/Post'); // Import model bài viết

class editorController {
    async show(req, res) {
        let user = null;
        user = JSON.parse(req.cookies.user);
        if (user.type !== 'editor') {
            //res.alert('Bạn không có quyền truy cập trang này');
            return res.redirect('/');
        }
        try {
            res.render('editorConfirmPage'); // Render trang tạo bài viết
        } catch (err) {
            console.error('Error rendering createPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang tạo bài viết');
        }
    }
    async get(req, res) {
        try {
            let user = null;
            user = JSON.parse(req.cookies.user);
            const drafts = await PostSchema.find({ 
              state: 'Chưa được duyệt', 
              idMainCategory: { $in: user.idCategory } // Chuyên mục do biên tập viên quản lý
            });
            console.log("Draft", drafts);
            res.status(200).json(drafts);
          } catch (error) {
            console.error('Error fetching drafts:', error);
            res.status(500).json({ error: 'Failed to fetch drafts' });
          }
    }

    async update(req, res) {
        try {
            const { category, tags, publishDate } = req.body;
            const postId = req.params.id;
        
            const updatedPost = await PostSchema.findByIdAndUpdate(
              postId,
              { status: 'approved', category, tags, publishDate },
              { new: true }
            );
        
            res.status(200).json({ message: 'Post approved successfully', post: updatedPost });
          } catch (error) {
            console.error('Error approving post:', error);
            res.status(500).json({ error: 'Failed to approve post' });
          }
    }

    async reject(req, res) {
        try {
            const { rejectionReason } = req.body;
            const postId = req.params.id;
        
            const updatedPost = await PostSchema.findByIdAndUpdate(
              postId,
              { status: 'Bị từ chối', rejectionReason },
              { new: true }
            );
        
            res.status(200).json({ message: 'Post rejected successfully', post: updatedPost });
          } catch (error) {
            console.error('Error rejecting post:', error);
            res.status(500).json({ error: 'Failed to reject post' });
          }
    }

}

module.exports = new editorController();
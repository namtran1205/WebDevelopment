// createPageController.js

const PostSchema = require('../models/Post'); // Đảm bảo bạn import đúng model của bạn

const createPageController = {
    async show(req, res) {
        try {
            res.render('createPage'); // Render trang tạo bài viết
        } catch (err) {
            console.error('Error rendering createPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang tạo bài viết');
        }
    },

    async post(req, res) {
        const { title, content, abstract, category, tag, state } = req.body;

        // Kiểm tra nếu dữ liệu không hợp lệ
        if (!title || !content || !category || !tag || !state) {
            return res.status(400).send('Tất cả các trường là bắt buộc');
        }

        try {
            const newPage = new PostSchema({
                title,
                content,
                abstract,
                category,
                tag,
                state
            });

            // Lưu bài viết mới vào cơ sở dữ liệu
            await newPage.save();
            res.redirect('/'); // Sau khi tạo thành công, chuyển hướng về trang chủ
        } catch (err) {
            console.error('Error saving new page:', err);
            res.status(500).send('Lỗi tạo trang mới');
        }
    }
};

module.exports = createPageController;

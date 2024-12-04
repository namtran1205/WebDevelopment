const PostSchema = require('../models/Post'); // Import model bài viết
const User = require('../models/User');

class createPageController {
    // Hiển thị trang tạo bài viết
    async show(req, res) {
        try {
            res.render('createPage'); // Render trang tạo bài viết
        } catch (err) {
            console.error('Error rendering createPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang tạo bài viết');
        }
    }

    // Xử lý tạo bài viết
    async post(req, res) {
        try {
            console.log('Request body:', req.body);

            const { title, abstract, content, idMainCategory, subCategory} = req.body;
            
            console.log('title:', title);

            // Kiểm tra dữ liệu đầu vào
            if (!title || !subCategory || !idMainCategory || !abstract || !content) {
                return res.status(400).json({ error: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
            }

            // Tạo bài viết mới
            const newPost = await new PostSchema({
                title,
                content,//content,
                abstract,
                subCategory,
                idMainCategory,
                state: 'Chưa được duyệt',
                idWriter: req.idWriter,
                image: "abc",//image,
                view: 0,
                viewWeek: 0,
            });

            // Lưu bài viết vào cơ sở dữ liệu
            await newPost.save();
            console.log('New post:', newPost);
            // Thành công
            res.status(201).json({ message: 'Bài viết đã được tạo thành công.', post: newPost });
        } catch (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ error: 'Lỗi khi tạo bài viết. Vui lòng thử lại sau.' });
        }
    }
}

module.exports = new createPageController();

const PostSchema = require('../models/Post'); // Import model bài viết
const User = require('../models/User');
const Tag = require('../models/Tag');

class createPageController {
    
    // Hiển thị trang tạo bài viết
    async show(req, res) {
        let user = null;
        user = JSON.parse(req.cookies.user);
        if (user.type !== 'writer') {
            //res.alert('Bạn không có quyền truy cập trang này');
            return res.redirect('/');
        }
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
            let user = null;
            user = JSON.parse(req.cookies.user);
            console.log('Request body:', req.body);

            const { title, content, abstract, image, subCategory, tags, idMainCategory, type} = req.body;
            
            console.log('title:', title);
            console.log('tag:',tags);

            // Kiểm tra dữ liệu đầu vào
            if (!title || !content || !abstract || !image || !subCategory || !tags || !idMainCategory || !type ) {
                return res.status(400).json({ error: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
            }

            // Kiểm tra xem tags có phải là mảng không
            const tagNames = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;


            console.log('tagNames:', tagNames);

            if (!Array.isArray(tagNames)) {
                console.error('Invalid tags format:', tagNames);
                return res.status(400).json({ message: 'Tags should be an array or a comma-separated string.' });
              }

            const tagIds = await Promise.all(
                tagNames.map(async (tagName) => {
                  // Tìm tag trong cơ sở dữ liệu
                  let tag = await Tag.findOne({ name: tagName });
          
                  // Nếu tag không tồn tại, tạo mới
                  if (!tag) {
                    
                    tag = await Tag.create({ name: tagName });
                  }
          
                  // Trả về _id của tag
                  return tag._id; // Chuyển đổi rõ ràng sang ObjectId
                })
                );
            console.log('tagIds:', tagIds);

            // Tạo bài viết mới
            const newPost = new PostSchema({
                title,
                content,//content,
                abstract,
                image,//image,
                subCategory,
                idMainCategory,
                state: 'Chưa được duyệt',
                idWriter: user._id,
                view: 0,
                viewWeek: 0,
                type,
                tags: tagIds,
            });

            // Lưu bài viết vào cơ sở dữ liệu
            await newPost.save();
            console.log('New post:', newPost);
            // Gắn bài viết vào các tag
            await Promise.all(
                tagIds.map(async (tagId) => {
                  await Tag.findByIdAndUpdate(
                    tagId,
                    { $addToSet: { posts: newPost._id } }, // Chỉ thêm nếu chưa có
                    { new: true }
                  );
                })
              );
            // Thành công
            //res.status(201).json({ message: 'Bài viết đã được tạo thành công.', post: newPost });
            res.redirect('/createPage');
        } catch (err) {
            console.error('Error creating post:', err);
            //res.status(500).json({ error: 'Lỗi khi tạo bài viết. Vui lòng thử lại sau.' });
        }
    }
}

module.exports = new createPageController();

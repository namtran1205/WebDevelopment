const PostSchema = require('../models/Post'); // Import model bài viết
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');

class writerController {
    
    // Hiển thị trang tạo bài viết
    async show_createPost(req, res) {
        let user = null;
        user = JSON.parse(req.cookies.user);
        if (user.type !== 'writer') {
            //res.alert('Bạn không có quyền truy cập trang này');
            return res.redirect('/');
        }
        try {
            res.render('writer/createPost'); // Render trang tạo bài viết
        } catch (err) {
            console.error('Error rendering createPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang tạo bài viết');
        }
    }

    // Xử lý tạo bài viết
    async post_createPost(req, res) {
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

            // Handle tags to add
        if (tagsToAdd && tagsToAdd.length > 0) {
          const tagNamesToAdd = tagsToAdd.split(',').map(tag => tag.trim());
          const tagIdsToAdd = await Promise.all(
            tagNamesToAdd.map(async (tagName) => {
              let tag = await TagSchema.findOne({ name: tagName });
  
              // Create new tag if it doesn't exist
              if (!tag) {
                tag = await TagSchema.create({ name: tagName });
              }
  
              // Add post reference to the tag
              await Tag.findByIdAndUpdate(tag._id, { $addToSet: { posts: post._id } });
              return tag._id;
            })
          );
  
          // Add new tags to the post
          post.tags = [...new Set([...post.tags, ...tagIdsToAdd])]; // Avoid duplicates
        }
  
        // Handle tags to remove
        if (tagsToRemove && tagsToRemove.length > 0) {
          const tagIdsToRemove = tagsToRemove.split(',').map(tag => tag.trim());
          await Promise.all(
            tagIdsToRemove.map(async (tagId) => {
              // Remove post reference from the tag
              await Tag.findByIdAndUpdate(tagId, { $pull: { posts: post._id } });
            })
          );
  
          // Remove tags from the post
          post.tags = post.tags.filter(tagId => !tagIdsToRemove.includes(tagId.toString()));
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
            res.redirect('/writer/createPost');
        } catch (err) {
            console.error('Error creating post:', err);
            //res.status(500).json({ error: 'Lỗi khi tạo bài viết. Vui lòng thử lại sau.' });
        }
    }
    
    async show_listPosts(req, res) {
        let user = null;
        user = JSON.parse(req.cookies.user);
        if (user.type !== 'writer') {
            //res.alert('Bạn không có quyền truy cập trang này');
            return res.redirect('/');
        }
        try {
            const posts = await PostSchema.find({ idWriter: user._id });
            res.render('writer/listPosts', { posts });
        } catch (err) {
            console.error('Error rendering listPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang danh sách bài viết');
        }
    }

    async show_post(req, res) {
      let user = null;
      user = JSON.parse(req.cookies.user);
      if (user.type !== 'writer') {
          //res.alert('Bạn không có quyền truy cập trang này');
          return res.redirect('/');
      }
      try {
          const post = await PostSchema.findById(req.params.id);
          res.render('writer/postDetail', { post });
      } catch (err) {
          console.error('Error rendering post:', err);
          res.status(500).send('Lỗi khi hiển thị trang bài viết');
      }
    }

    async detail(req, res) {
      try {
        const post = await PostSchema.findById(req.params.id)
          .populate('idMainCategory', 'name') // Populate main category name
          .populate('tags', 'name'); // Populate tag names
    
        if (!post) {
          return res.status(404).send('Draft not found');
        }
    
        res.render('writer/postDetail', { post });
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    }

    async show_editPost(req, res) {
      try {
        const post = await PostSchema.findById(req.params.id);
        //const categories = await MainCategory.find();
    
        if (!post) return res.status(404).send('Post not found');
        res.render('writer/editPost', { post});
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    }
    

    async post_updatePost(req, res) {
      try {
        const { title, abstract, image, content, idMainCategory, subCategory, type, tags } = req.body;
    
        await PostSchema.findByIdAndUpdate(req.params.id, {
          title,
          abstract,
          image,
          content,
          idMainCategory,
          subCategory,
          type,
          tags: tags.split(',').map(tag => tag.trim())
        });
    
        res.redirect(`/writer/post/${req.params.id}`);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    }
    
    
}

module.exports = new writerController();

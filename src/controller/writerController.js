const PostSchema = require('../models/Post'); // Import model bài viết
const Comment = require('../models/Comment');
const Tag = require('../models/Tag');
const MainCategory = require('../models/MainCategory');
const mongoose = require('mongoose'); // Import mongoose
class writerController {
  async show(req, res) {
    let user = null;
    user = JSON.parse(req.cookies.user);
    if (user.type !== 'writer') {
        //res.alert('Bạn không có quyền truy cập trang này');
        return res.redirect('/');
    }
    try {

      const approvedPostsCount = await PostSchema.countDocuments({
        state: 'Đã được duyệt và chờ xuất bản',
        idWriter: user._id
      });

      const publishedPostsCount = await PostSchema.countDocuments({
        state: 'Đã xuất bản',
        idWriter: user._id
      });

      const rejectedPostsCount = await PostSchema.countDocuments({
        state: 'Bị từ chối',
        idWriter: user._id
      });

      const pendingPostsCount = await PostSchema.countDocuments({ 
        state: 'Chưa được duyệt',
        idWriter: user._id
       });
      res.render('writer/dashboard', {
        pendingPostsCount,
        approvedPostsCount,
        publishedPostsCount,
        rejectedPostsCount
      });
    } catch (err) {
        console.error('Error rendering page:', err);
        res.status(500).send('Lỗi khi hiển thị trang');
    }
}

    
    // Hiển thị trang tạo bài viết
    async show_createPost(req, res) {
        try {
            const maincategories = await MainCategory.find();
            res.render('writer/createPost', {maincategories}); // Render trang tạo bài viết
        } catch (err) {
            console.error('Error rendering createPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang tạo bài viết');
        }
    }

    // Xử lý tạo bài viết
    async post_createPost(req, res) {
        try {
            //console.log('Request body:', req.body);
            //console.log('File:', req.file);
            
            const { title, content, abstract, subCategory, tags, image, idMainCategory, type} = req.body;
            
            //console.log('title:', title);
            //console.log('tag:',tags);

            // Kiểm tra dữ liệu đầu vào
            if (!title || !content || !abstract || !image || !subCategory || !idMainCategory || !type ) {
                return res.status(400).json({ error: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
            }
            

            // kiểm tra không phân loại category
            let postCategory = idMainCategory;
            let postSubcategory = subCategory;
            console.log(idMainCategory);
            if (idMainCategory == "null")
            {
              postCategory = null;
              postSubcategory = null;
            }

            // if (req.file) {
            //   thumbnail = `/uploads/${req.file.filename}`
            // }
        
            //console.log('thumbnail:', thumbnail);
            // Kiểm tra xem tags có phải là mảng không
            let tagIds = [];
            if (tags) {
              const tagNames = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;

              //console.log('tagNames:', tagNames);

              if (!Array.isArray(tagNames)) {
                console.error('Invalid tags format:', tagNames);
                return res.status(400).json({ message: 'Tags should be an array or a comma-separated string.' });
              }

              tagIds = await Promise.all(
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
            } else {
              tagIds = [];
            }
            //console.log('tagIds:', tagIds);
            // let compressedImageBase64 = null;
            // if (image) {
            //   const imageBuffer = Buffer.from(image, 'base64');
            //   const compressedImage = await sharp(imageBuffer)
            //     .resize({ width: 600 }) // Resize ảnh
            //     .jpeg({ quality: 80 }) // Nén ảnh với chất lượng 80%
            //     .toBuffer();
            //   compressedImageBase64 = compressedImage.toString('base64');
            // }
            //let compressedImageBase64 = null;
            //console.log(tagIds);
            
    
            // Tạo bài viết mới
            const newPost = new PostSchema({
                title,
                content,//content,
                abstract,
                image,
                subCategory : postSubcategory,
                idMainCategory : postCategory,
                state: 'Chưa được duyệt',
                idWriter: req.idWriter,
                view: 0,
                viewWeek: 0,
                type,
                tags: tagIds,
            });

            // Lưu bài viết vào cơ sở dữ liệu
            await newPost.save();
            res.redirect('/writer/createPost');
        } catch (err) {
            console.error('Error creating post:', err);
            //res.status(500).json({ error: 'Lỗi khi tạo bài viết. Vui lòng thử lại sau.' });
        }
    }
    
    async show_listPosts(req, res) {
        try {
            // const posts = await PostSchema.find({ idWriter: req.idWriter })
            // .select('title state idMainCategory views')
            // .populate('idMainCategory').exec();
            const posts = await PostSchema.aggregate([
              // 1. Lọc bài viết theo `idWriter`
              {
                  $match: { idWriter: req.idWriter }
              },
              // 2. Thực hiện `$lookup` để nối bảng với `maincategories`
              {
                  $lookup: {
                      from: "maincategories", // Tên collection để join
                      localField: "idMainCategory", // Trường trong PostSchema
                      foreignField: "_id", // Trường trong MainCategorySchema
                      as: "categoryRef" // Tên mảng chứa kết quả join
                  }
              },
              // 3. Định dạng lại kết quả trả về
              {
                  $project: {
                      title: 1, // Trả về trường "title"
                      state: 1, // Trả về trường "state"
                      views: 1, // Trả về trường "views"
                      reason: 1,
                      category: { $arrayElemAt: ["$categoryRef.name", 0] } // Trích trường "name" từ categoryRef
                  }
              }
          ]);

            //console.log(posts);
            res.render('writer/listPosts', { posts });
        } catch (err) {
            console.error('Error rendering listPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang danh sách bài viết');
        }
    }

    async show_post(req, res) {
      try {
          const post = await PostSchema.findById(req.params.id).populate('tags').exec();
          const comments = await Comment.find(
            { idPost: req.params.id}
        );
          res.render('writer/postDetail', { post, comments});
      } catch (err) {
          console.error('Error rendering post:', err);
          res.status(500).send('Lỗi khi hiển thị trang bài viết');
      }
    }

    async show_editPost(req, res) {
      try {
        const post = await PostSchema.findById(req.params.id).populate('tags').exec();
        let editable = true;
        if (post.state != "Bị từ chối" && post.state != "Chưa được duyệt" && res.locals.user.type !== "admin")
        {
          editable = false;
        }
        const tags = await Tag.find();
        //const categories = await MainCategory.find();
        const maincategories = await MainCategory.find();
    
        if (!post) return res.status(404).send('Post not found');
        res.render('writer/editPost', { post, tags, editable, maincategories });
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    }
    

    async post_updatePost(req, res) {
      try {
        const { title, abstract, image, content, idMainCategory, subCategory, type, tagsToAdd, tagsToRemove } = req.body;
        //console.log(req.params.id);
        const post = await PostSchema.findById(req.params.id);
        if (!post) {
          return res.status(404).send('Post not found');
        }

        // kiểm tra không phân loại category
        let postCategory = idMainCategory;
        let postSubcategory = subCategory;
        //console.log(idMainCategory);
        if (idMainCategory == "null")
        {
          postCategory = null;
          postSubcategory = null;
        }

        // Handle tags to add
        if (tagsToAdd && tagsToAdd.length > 0) {
          const tagNamesToAdd = tagsToAdd.split(',').map(tag => tag.trim());
          const tagIdsToAdd = await Promise.all(
            tagNamesToAdd.map(async (tagName) => {
              let tag = await Tag.findOne({ name: tagName });
  
              // Create new tag if it doesn't exist
              if (!tag) {
                tag = await Tag.create({ name: tagName });
              }
  
              // Add post reference to the tag
              // await Tag.findByIdAndUpdate(tag._id, { $addToSet: { posts: post._id } });
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
              // await Tag.findByIdAndUpdate(tagId, { $pull: { posts: post._id } });
            })
          );
  
          // Remove tags from the post
          post.tags = post.tags.filter(tagId => !tagIdsToRemove.includes(tagId.toString()));
        }
    
        await PostSchema.findByIdAndUpdate(req.params.id, {
          title,
          abstract,
          image,
          content,
          idMainCategory : postCategory,
          subCategory : postSubcategory,
          type,
          tags: post.tags,
          state: 'Chưa được duyệt',
          reason: null
        });
    
        res.redirect(`/writer/post/${req.params.id}`);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    }
    
    async deletePost(req, res) {
      try {
        const deletedPost = await PostSchema.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
          return res.status(404).send('Bài viết không tồn tại');
        }
        
        res.status(200).json({ message: 'Bài viết đã được xóa' });
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    }
    
}

module.exports = new writerController();

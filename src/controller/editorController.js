const PostSchema = require('../models/Post'); // Import model bài viết
const UserSchema = require('../models/User'); // Import model người dùng
const TagSchema = require('../models/Tag'); // Import model tag
const Notification = require('../models/Notification');

class editorController {
    async show(req, res) {
        let user = null;
        user = JSON.parse(req.cookies.user);
        if (user.type !== 'editor') {
            //res.alert('Bạn không có quyền truy cập trang này');
            return res.redirect('/');
        }
        try {
          const processedPostsCount = await PostSchema.countDocuments({ 
            state: { $in: ['Đã được duyệt và chờ xuất bản', 'Đã xuất bản', 'Bị từ chối']},
              idMainCategory: user.idCategory
             
          });
    
          const pendingPostsCount = await PostSchema.countDocuments({ state: 'Chưa được duyệt',
            idMainCategory: user.idCategory
           });
          res.render('editor/dashboard', {
            processedPostsCount,
            pendingPostsCount,
          });
        } catch (err) {
            console.error('Error rendering createPage:', err);
            res.status(500).send('Lỗi khi hiển thị trang tạo bài viết');
        }
    }
    async getDrafts(req, res) {
        let user = null;
        user = JSON.parse(req.cookies.user);
        if (user.type !== 'editor') {
            return res.redirect('/');
            //console.log("User", req.cookies);
        }
        try {
            
          const drafts = await PostSchema.find({
              state: 'Chưa được duyệt',
              idMainCategory: { $in: user.idCategory },
          }).select('title state').exec();
          
          //console.log(drafts);
          
          res.render('editor/drafts', { drafts });
          } catch (error) {
            console.error('Error fetching drafts:', error);
            res.status(500).json({ error: 'Failed to fetch drafts' });
          }
    }

    async getPosts(req, res) {
      let user = null;
      user = JSON.parse(req.cookies.user);
      if (user.type !== 'editor') {
          return res.redirect('/');
          //console.log("User", req.cookies);
      }
      try {
          const posts = await PostSchema.find({
            state: { $in: ['Đã được duyệt và chờ xuất bản', 'Đã xuất bản', 'Bị từ chối'] },
            idMainCategory: { $in: user.idCategory },
        }).select('title state').exec();
        
        //console.log(drafts);
        
        res.render('editor/posts', { posts });
        } catch (error) {
          console.error('Error fetching posts:', error);
          res.status(500).json({ error: 'Failed to fetch posts' });
        }
      }

    async detail(req, res) {
      try {
    
        const post = await PostSchema.findById(req.params.id).populate('tags').exec();
        //console.log(draft);
        const tags = await TagSchema.find();
        //console.log(draft);
        // if (!draft || draft.state !== "Chưa được duyệt") {
        //   return res.status(404).send('Draft not found');
        // }
        if (!post) {
          return res.status(404).send('Post not found');
        }
        
          res.render('editor/detail', { post, tags });
      } catch (err) {
        console.error(err); // Log the actual error for debugging
        res.status(500).send('Server Error');
      }
    }


    async approve(req, res) {
      try {
        const { id } = req.params;
        const { idMainCategory, tagsToAdd, tagsToRemove, publishDate } = req.body;
        console.log(publishDate);
  
        const post = await PostSchema.findById(id);
        if (!post || post.state !== 'Chưa được duyệt') {
          return res.status(404).send('Post not found or already approved.');
        }
  
        // Update main category
        if (idMainCategory) {
          post.idMainCategory = idMainCategory;
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
              await TagSchema.findByIdAndUpdate(tag._id, { $addToSet: { posts: post._id } });
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
              await TagSchema.findByIdAndUpdate(tagId, { $pull: { posts: post._id } });
            })
          );
  
          // Remove tags from the post
          post.tags = post.tags.filter(tagId => !tagIdsToRemove.includes(tagId.toString()));
        }
  
        // Update publish time
        if (publishDate) {
          post.publishedDate = new Date(publishDate);
        }
  
        // Change post state to approved
        post.state = 'Đã được duyệt và chờ xuất bản';
        await post.save();
  
        res.redirect('/editor/drafts'); // Redirect to editor's main page
      } catch (err) {
        console.error('Error approving post:', err);
        res.status(500).send('Server Error');
      }
    }

    async reject(req, res) {
      try {
        const { reason } = req.body;
        await PostSchema.findByIdAndUpdate(req.params.id, { state: 'Bị từ chối', reason: reason });
        res.redirect('/editor/drafts');
      } catch (err) {
        res.status(500).send('Server Error');
      }
    }


}

module.exports = new editorController();
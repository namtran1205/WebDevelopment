const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');

class getPosts {
    getListPosts= async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 8;
        const skip = (page - 1) * pageSize;
        const id = req.params.id;
        const isCategoryPage = req.originalUrl.includes('/category/');
        const isTagPage = req.originalUrl.includes('/tag/');
        const isSubCategoryPage = req.originalUrl.includes('/subcategory/');
        let totalPage;
        try {
            let posts;
            if (isCategoryPage) {
              posts = await Post.find({idMainCategory: id })
                .skip(skip)
                .limit(pageSize)
                .sort({ publishedDate: -1 });
                totalPage = Math.ceil((await Post.find({idMainCategory: id})).length/pageSize);
            } else if (isTagPage) {
              posts = await Post.find({tags: { $in: id }}) 
                .skip(skip)
                .limit(pageSize)
                .sort({ publishedDate: -1 });
                totalPage = Math.ceil((await Post.find({tags: { $in: id }})).length/pageSize);
            } else if (isSubCategoryPage) {
              posts = await Post.find({subCategory: id})
              .skip(skip)
              .limit(pageSize)
              .sort({ publishedDate: -1 });
              totalPage = Math.ceil((await Post.find({subCategory: id})).length/pageSize);
            }
            const postsWithTags = await Promise.all(
                posts.map(async (post) => {
                    const tags = await Tag.find({ _id: { $in: post.tags } });
                    const categories = await MainCategory.find({ _id: post.idMainCategory } );
                    await Promise.all(
                        tags.map(async (tag) => {
                            await Tag.findByIdAndUpdate(
                                tag._id,
                                { $addToSet: { posts: post.id } }, 
                                { new: true } 
                            );
                        })
                    );
                    const tagNames = tags.map(tag => tag.name);
                    await Promise.all(
                        categories.map(async (cate) => {
                            await MainCategory.findByIdAndUpdate(
                                cate._id,
                                { $addToSet: { posts: post.id } }, 
                                { new: true } 
                            );
                        })
                    );
                    return { ...post._doc, tagNames, categories};
                })
            );
            const tags = await Tag.find();
    
            res.render('listItem', {posts: postsWithTags, tags: tags, currentPage: page, id, isCategoryPage, isTagPage, isSubCategoryPage, totalPage });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi lấy danh sách bài viết',
            });
        }
    };
} 

module.exports = new getPosts();

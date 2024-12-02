const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');

const getPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({tags: { $in: id }});
        const postsWithTags = await Promise.all(
            posts.map(async (post) => {
                const tags = await Tag.find({ _id: { $in: post.tags } });
                const categories = await MainCategory.find({ _id: { $in: post.idCategory } });
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

        res.render('listItem', {posts: postsWithTags, tags: tags} );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy danh sách bài viết',
        });
    }
};

module.exports = {
    getPosts
};

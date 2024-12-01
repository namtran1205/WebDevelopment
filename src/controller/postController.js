const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        const postsWithTags = await Promise.all(
            posts.map(async (post) => {
                const tags = await Tag.find({ _id: { $in: post.tags } });
                await Promise.all(
                    tags.map(async (tag) => {
                        await Tag.findByIdAndUpdate(
                            tag._id,
                            { $addToSet: { posts: post.id } }, 
                            { new: true } 
                        );
                    })
                );
                return { ...post._doc, tags};
            })
        );
        
        res.status(200).json({
            success: true,
            data: postsWithTags,
        });
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

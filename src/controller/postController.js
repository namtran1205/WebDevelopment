const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ idCategory: { $ne: null } })
        .populate({
            path: 'idCategory',
            select: 'name',
            options: { strictPopulate: false },
            populate: {
                path: '_id',
                model: 'MainCategory',
            },
        })
            .populate('tags', 'name');
        res.status(200).json({
            success: true,
            data: posts,
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

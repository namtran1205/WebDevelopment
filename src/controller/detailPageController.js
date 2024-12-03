const { render } = require('ejs');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Tag = require('../models/Tag')

const detailPageController =
{
    async show(req, res)
    {   
        try {
            const idPost = req.params.idPost;

            const post = await Post.findOneAndUpdate(
                { _id: idPost },
                { $inc: { view: 1, viewWeek: 1 } },
                { new: true }
            );

            if (!post) {
                return res.status(404).json( { error: "Post not found" } );
            }


            const tags = await Tag.find({ _id: { $in: post.tags } });
            const tagNames = tags.map(tag => tag.name);
            //Chưa có dữ liệu nên tôi không test được sorry
            // const comments = await Comment.find( {idPost: idPost}, {
            //     _id: 0,
            //     idPost: 0,
            //     writer: 1,
            //     content: 1,
            // });

            const relevantPosts = await Post.find( { subCategory: post.subCategory }, {
                _id: 1,
                title: 1,
                abstract: 1,
                image: 1,
                subCategory: 1,
            }).sort( { publishedDate: -1 }).limit(5);
            let subCategory = post.subCategory;

            res.render('detailPage', { post, tagNames, relevantPosts, subCategory });
        } catch(err) {
            res.status(400).json( { error: err.message });
        }
    },
    
    async postComment(req, res) {
        try {
            const idPost = req.params;
            const { writer, content } = req.body;

            const comment = new Comment({
                writer: writer,
                content: content,
                idPost: idPost,
            });

            const savedComment = await comment.save();

            res.status(201).json(savedComment);
        } catch(error) {    
            res.status(400).json({ error: error.message});
        }
    }
};

module.exports = detailPageController;
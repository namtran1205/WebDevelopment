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

            const post = await Post.findOne( { _id : idPost}, {
                _id: 0,
                title: 1,
                content: 1,
                subCategory: 1,
                mainCategory: 1,
                image: 1,
                publishedDate: 1,
            });

            if (!post) {
                return res.status(404).json( { error: "Post not found" } );
            }
            
            const tags = await Tag.find( { idPost: idPost }, {
                _id: 0,
                idPost: 0,
                tag: 1,
            } );

            const comments = await Comment.find( {idPost: idPost}, {
                _id: 0,
                idPost: 0,
                writer: 1,
                content: 1,
            });

            // Only get at most 5 latest posts
            const relevantPosts = await Post.find( { mainCategory: post.mainCategory }, {
                _id: 0,
                title: 1,
                abstract: 1,
                image: 1,
                mainCategory: 1,
                subCategory: 1,
            }).sort( { publishedDate: -1 }).limit(5);

            res.render('detailPage', { post, comments, tags, relevantPosts });
        } catch(err) {
            res.status(400).json( { error: err.message });
        }
    },
    
    async postCommnet(req, res) {
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
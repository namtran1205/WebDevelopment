const { render } = require('ejs');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Tag = require('../models/Tag');
const MainCategory = require('../models/MainCategory');
const PDFDocument = require('pdfkit');
const path = require('path');
const { convert } = require('html-to-text');
const axios = require('axios');
const fs = require('fs');

const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9_\-]/gi, '_');
};

async function downloadImage(url) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
    });
    return Buffer.from(response.data, 'binary');
}


const detailPageController =
{
    async show(req, res)
    {   
        try {
            const { idPost } = req.params;

            const post = await Post.findOneAndUpdate(
                { _id: idPost },
                { $inc: { view: 1, viewWeek: 1 } },
                { new: true }
            ).select("title content subCategory tags image publishedDate view type idMainCategory");

            if (!post) {
                return res.status(404).json( { error: "Post not found" } );
            }
            
            let d = null;
            let d2 = null;
            if (res.locals.user)
            {
                d = new Date(res.locals.user.remainingTime);
                d2 = new Date();
            }

            if (post.type === "premium" && 
                (   
                    !res.locals.user || 
                    (res.locals.user.type != "subscriber" && res.locals.user.type != "admin") ||
                    (res.locals.user.type == "subscriber" && d < d2)
                ))
            {
                res.status(403).render('noAccess');
                return;
            }


            const tags = await Tag.find({ _id: { $in: post.tags } });
            const tagNames = tags.map(tag => tag.name);
            //Chưa có dữ liệu nên tôi không test được sorry
            const comments = await Comment.find(
                { idPost: idPost },
                { writer: 1, content: 1, createdAt: 1 }
            );


            const relevantPosts = await Post.find( { idMainCategory: post.idMainCategory, state: "Đã xuất bản", _id: { $ne: idPost } }, {
                _id: 1,
                title: 1,
                abstract: 1,
                image: 1,
                subCategory: 1,
            }).sort( { publishedDate: -1 }).limit(5);
            let subCategory = post.subCategory;
            let mainCategory = await MainCategory.findOne({_id: post.idMainCategory});
            res.render('detailPage', { post, tagNames, relevantPosts, subCategory, comments, mainCategory });
        } catch(err) {
            res.status(400).json( { error: err.message });
        }
    },
    
    async postComment(req, res) {
        try {
            const { idPost } = req.params;
            const { writer, content } = req.body;

            const comment = new Comment({
                writer: writer,
                content: content,
                idPost: idPost,
            });

            const savedComment = await comment.save();

            res.redirect(`/detailPage/${idPost}`);
        } catch(error) {    
            res.status(400).json({ error: error.message});
        }
    },
  
    async  download(req, res) {
        try {
            const { id } = req.params;
            const article = await Post.findOne({ _id: id });
            if (!article) {
                return res.status(404).send('Article not found.');
            }
    
            const sanitizedTitle = sanitizeFilename(article.title); 
            const doc = new PDFDocument();
            res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle}.pdf"`);
            res.setHeader('Content-Type', 'application/pdf');
    
            doc.pipe(res);
    
            const fontPath = path.join(__dirname, '../fonts', 'font.ttf'); 
            doc.font(fontPath);
    
            const plainTextContent = convert(article.content, {
                wordwrap: 130, 
                selectors: [
                    { selector: 'img', format: 'skip' }, 
                    { selector: 'iframe', format: 'skip' }, 
                    { selector: 'a', options: { ignoreHref: true } },
                ],
            });
    
            doc.fontSize(12).text(plainTextContent);
    
            doc.end();
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('Error downloading the article.');
        }
    }
    
};

module.exports = detailPageController;
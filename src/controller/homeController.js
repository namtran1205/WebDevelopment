const { render } = require('ejs');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');
const Post = require('../models/Post');

class homeController {
    async show(req, res, next) {
        try {
            const today = new Date();
            const dayOfWeek = today.getDay();
    
            if (dayOfWeek === 0) {
                await Post.updateMany({ viewWeek: { $gt: 0 } }, { $set: { viewWeek: 0 } });
            }
    
            const postProjection = { title: 1, publishedDate: 1, image: 1, subCategory: 1, type: 1 };
            console.time('Data Fetching');
    
            const [postOfWeek, postMostView, postNew, hotCategory, tags] = await Promise.all([
                Post.aggregate([
                    { $match: { state: "Đã xuất bản" } },
                    { $sort: { viewWeek: -1 } },
                    { $limit: 4 },
                    { $project: postProjection }
                ]).exec(),
                Post.aggregate([
                    { $match: { state: "Đã xuất bản" } },
                    { $sort: { view: -1 } },
                    { $limit: 10 },
                    { $project: postProjection }
                ]).exec(),
                Post.aggregate([
                    { $match: { state: "Đã xuất bản" } },
                    { $sort: { createAt: -1 } },
                    { $limit: 10 },
                    { $project: postProjection }
                ]).exec(),
                MainCategory.aggregate([
                    { $lookup: { 
                        from: 'posts', 
                        localField: '_id', 
                        foreignField: 'idMainCategory', 
                        as: 'posts',
                        pipeline: [
                            { $match: { state: "Đã xuất bản" } },
                            { $project: { view: 1, title: 1, publishedDate: 1, image: 1 } }
                        ]
                    }},
                    { $unwind: '$posts' },
                    { $group: { 
                        _id: '$name', 
                        totalViews: { $sum: '$posts.view' }, 
                        latestPost: { $first: '$posts' } 
                    }},
                    { $sort: { totalViews: -1 } },
                    { $limit: 10 }
                ]).exec(),
                Tag.find({}, { name: 1 }).lean()
            ]);
    
            console.timeEnd('Data Fetching');
    
            res.render('homepage', { tags, postOfWeek, postMostView, postNew, hotCategory });
        } catch (error) {
            next(error);
        }
    }
  
    getLogin(req, res, next) {
      res.locals.user = null;
      res.clearCookie('user');
      res.render('login');
    }
  }
  
  module.exports = new homeController();
  
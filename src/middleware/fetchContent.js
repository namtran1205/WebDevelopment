const express = require('express');
const app = express();
const MainCategory = require('../models/MainCategory');
const Post = require('../models/Post');

async function fetchCategories(req, res, next) {
    try {
        const categoriesWithSubCategories = await MainCategory.aggregate([
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'idMainCategory',
                    as: 'posts'
                }
            },
            {
                $unwind: '$posts'
            },
            {
                $match: {
                    'posts.state': 'Đã xuất bản'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    posts: { $push: '$posts' }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    subCategories: {
                        $reduce: {
                            input: {
                                $map: {
                                    input: '$posts',
                                    as: 'post',
                                    in: {
                                        $cond: {
                                            if: { $isArray: '$$post.subCategory' },
                                            then: '$$post.subCategory',
                                            else: [{ $ifNull: ['$$post.subCategory', null] }]
                                        }
                                    }
                                }
                            },
                            initialValue: [],
                            in: { $setUnion: ['$$value', '$$this'] }
                        }
                    }
                }
            }
        ]);

        res.locals.categories = categoriesWithSubCategories;
        next();
    } catch (error) {
        next(error);
    }
}



module.exports = fetchCategories;

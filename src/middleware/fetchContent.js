const express = require('express');
const app = express();
const MainCategory = require('../models/MainCategory');
const Post = require('../models/Post');

async function fetchCategories(req, res, next) {
    try {
        const mainCategories = await MainCategory.find();

        const categoriesWithSubCategories = await Promise.all(
            mainCategories.map(async (category) => {
                const posts = await Post.find({ idMainCategory: category._id });

                const subCategories = posts.map(post => post.subCategory);
                return {
                    _id: category._id,
                    name: category.name,
                    subCategories: [...new Set(subCategories)] 
                };
            })
        );

        res.locals.categories = categoriesWithSubCategories;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = fetchCategories;

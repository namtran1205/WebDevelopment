const express = require('express');
const app = express();
const MainCategory = require('../models/MainCategory');

async function fetchCategories(req, res, next) {
    try {
        const categories = await MainCategory.find();
        res.locals.categories = categories;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = fetchCategories;

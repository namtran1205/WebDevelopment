const { render } = require('ejs');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');

class homeController {
    async show(req, res, next) {
        let loginContent = null;
        const tags = await Tag.find();
        const categories = await MainCategory.find();
        res.locals.categories = categories;
        res.render('homepage', {tags: tags});
    }
    getListItem(req, res, next) {
        const csvFilePath = path.join(__dirname, '../dataset.csv');
        const data = [];
        
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            data.push({
              title: row['Title'], 
              urlPicture: row['URL Picture'],
              date: row['Date'], 
              idCategory: row['ID Category'],
              subCategory: row['Category(Sub)'],
              views: row['View'],
              idPost: row['ID'],
              content: row['Content'],
            });
          })
          .on('end', () => {
            res.render('listItem', { articles: data });
          })
          .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            res.status(500).send('Internal Server Error');
          });
      }
    getLogin(req, res, next) {
        res.locals.user = null;
        res.clearCookie('user');
        res.render('login');
      }
};

module.exports = new homeController();
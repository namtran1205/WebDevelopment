const { render } = require('ejs');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

class homeController {
    show(req, res, next) {
        let loginContent = null;
        res.render('homepage');
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
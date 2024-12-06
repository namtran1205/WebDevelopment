const { render } = require('ejs');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');
const Post = require('../models/Post');

class homeController {
    async show(req, res, next) {
        let loginContent = null;
        const today = new Date();
        const posts = await Post.find();
        const dayOfWeek = today.getDay();
        if (dayOfWeek === 0) {
          posts.forEach((post)=>{
            post.viewWeek = 0;
          })
        }
        const sortedPosts = posts.sort((a, b) => b.viewWeek - a.viewWeek);
        const postOfWeek = sortedPosts.slice(0, 4);
        const postMostView =  posts.sort((a, b) => b.view - a.view).slice(0, 10);
        const postNew =  await Post.find()  
        .sort({ publishedDate: -1 }) 
        .limit(10); 
        const hotCategory = await MainCategory.aggregate([
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
              $group: {
                  _id: '$name', 
                  totalViews: { $sum: '$posts.view' },
                  latestPost: { $first: '$posts' } 
              }
          },
          {
            $sort: { 'posts.publishedDate': -1 } 
          },
          {
              $sort: { totalViews: -1 }  
          },
          {
              $limit: 10 
          }
      ]);
        const tags = await Tag.find();

        res.render('homepage', {tags: tags, postOfWeek, postMostView, postNew, hotCategory});
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

function getPostsInCurrentWeek(posts) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return posts.filter(post => {
      const postDate = new Date(post.date);
      return postDate >= startOfWeek;
  });
}

module.exports = new homeController();
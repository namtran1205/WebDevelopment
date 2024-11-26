const { render } = require('ejs');
const path = require('path');
const fs = require('fs');

class homeController {
    show(req, res, next) {
        let loginContent = null;
        res.render('homepage');
    }
    getListItem(req, res, next) {
        res.render('listItem');
    }
    getLogin(req, res, next) {
        res.clearCookie('subscriber');
        res.clearCookie('admin');
        res.clearCookie('writer');
        res.clearCookie('editor');
        res.render('login');
      }
};

module.exports = new homeController();
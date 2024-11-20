const { render } = require('ejs');
const path = require('path');
const fs = require('fs');

class homeController {
        let loginContent = null;
        res.render('homepage');
    }
    getListItem(req, res, next) {
        res.render('listItem');
    }
    getLogin(req, res, next) {
        res.render('login');
      }
}

module.exports = new homeController();
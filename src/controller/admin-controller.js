const { render } = require('ejs');

class adminController {
    async show(req, res) {
        res.render('adminPage');
    }
};

module.exports = new adminController();
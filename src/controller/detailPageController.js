const { render } = require('ejs');

const detailPageController =
{
    async show(req, res)
    {
        res.render('detailPage');
    },
    
};

module.exports = detailPageController;
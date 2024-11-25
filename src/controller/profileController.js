const { render } = require('ejs');

const profileController =
{
    async show(req, res)
    {
        res.render('profile');
    },

    async update(req, res)
    {
        res.render('profile/update');
    }
};

module.exports = profileController;
const { render } = require('ejs');
const User = require('../models/User');


const profileController =
{
    async show(req, res) {
        let user = null;
        let userId = null;
        let userType = null;

        switch (true) {
            case !!req.cookies.subscriber:
                user = JSON.parse(req.cookies.subscriber);
                userId = user._id;
                userType = 'Độc giả';
                break;
            case !!req.cookies.admin:
                user = JSON.parse(req.cookies.admin);
                userId = user._id;
                userType = 'Quản trị viên';
                break;
            case !!req.cookies.writer:
                user = JSON.parse(req.cookies.writer);
                userId = user._id;
                userType = 'Phóng viên';
                break;
            case !!req.cookies.editor:
                user = JSON.parse(req.cookies.editor);
                userId = user._id;
                userType = 'Biên tập viên';
                break;
        }

        res.render('profile', { userId, userType, user });
    },

    async update(req, res)
    {
        let user = null;
        let userId = null;

        switch (true) {
            case !!req.cookies.subscriber:
                user = JSON.parse(req.cookies.subscriber);
                userId = user._id;
                
                break;
            case !!req.cookies.admin:
                user = JSON.parse(req.cookies.admin);
                userId = user._id;
                
                break;
            case !!req.cookies.writer:
                user = JSON.parse(req.cookies.writer);
                userId = user._id;
                
                break;
            case !!req.cookies.editor:
                user = JSON.parse(req.cookies.editor);
                userId = user._id;
                
                break;
        }
    
        res.render('profile', { userId, user });
    }
};

module.exports = profileController;
const { render } = require('ejs');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const profileController =
{
    async show(req, res) {
        let user = null;
        let userId = null;
        user = JSON.parse(req.cookies.user);
        userId = user._id;
        userType = capitalizeFirstLetter(user.type);
        res.render('profile', { userId, userType, user });
    },
    async extend(req, res) {
        user = JSON.parse(req.cookies.user);
        userId = user._id;   
        extendUser = await User.findOne({_id: userId});
        const currentEndDate = new Date(extendUser.remainingTime);
        let newEndDate = new Date(currentEndDate.setDate(currentEndDate.getDate() + 7));
        extendUser.remainingTime = newEndDate;
        res.cookie('user', JSON.stringify(extendUser), { httpOnly: true });
        await  extendUser.save();
        res.redirect(`/profile/${extendUser._id}`);
    },
    async update(req, res)
    {
        let user = null;
        let userId = null;
        user = JSON.parse(req.cookies.user);
        userId = user._id;

        const newData = req.body;
        try {
            if (newData.displayName && Array.isArray(newData.displayName)) {
                newData.displayName = newData.displayName.join(' ').trim();
                newData.nickName = newData.nickName.join(' ').trim();
                newData.email = newData.email.join(' ').trim();
            }
            await User.findByIdAndUpdate({_id: userId}, {fullName: newData.displayName, email: newData.email, nickname: newData.nickName}, { new: true })
            .then(async ()  => {
            const getUser = await User.findOne({_id: userId});
            if (getUser) {
                res.cookie('user', JSON.stringify(getUser), { httpOnly: true });
            } 
              res.redirect(`/profile/${userId}`); 
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send('Lỗi cập nhật thông tin người dùng');
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Internal server error');
        }
    },
    async changePassword(req, res) {
        let user = null;
        let userId = null;

        user = JSON.parse(req.cookies.user);
        userId = user._id;
    
        if (!userId) {
            return res.status(401).send('Bạn chưa đăng nhập.');
        }
    
        const { currentPassword, temp, newPassword } = req.body;
    
        try {
            const dbUser = await User.findById(userId);
    
            if (!dbUser) {
                return res.status(404).send('Người dùng không tồn tại.');
            }
    
            const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
            if (!isMatch) {
                return res.status(400).send('Mật khẩu hiện tại không chính xác.');
            }
            const hashPassword = await bcrypt.hash(newPassword, 10);
            dbUser.password = hashPassword; 
            await dbUser.save();
    
            res.cookie('user', JSON.stringify(dbUser), { httpOnly: true });
            console.log(newPassword);
            res.redirect(`/profile/${userId}`); 
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).send('Lỗi trong quá trình đổi mật khẩu.');
        }
    },
    logout(req, res) {
        res.clearCookie('user');
        res.locals.user = null;
    }
    
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = profileController;
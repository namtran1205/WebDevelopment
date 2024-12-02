const User = require('../models/User');
const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');
const { name } = require('ejs');

// data fetch
function getUsers (limit, skip)
{
    limit = limit > 0 ? limit : 0; // 0 = no limit
    skip = skip > 0 ? skip : 0;

    return User.find({}).select({
        email : 1,
        fullName : 1,
        type : 1,
    }).skip(skip).limit(limit);
}

function getPosts (limit, skip)
{

    limit = limit > 0 ? limit : 0; // 0 = no limit
    skip = skip > 0 ? skip : 0;

    return Post.find({}).select({
        title : 1,
        category : 1,
        tag : 1,
        state : 1,
    }).limit(limit).skip(skip);
}

function deleteUser (id)
{
    return User.deleteOne({ _id : id });
}

function deletePost (id)
{
    return Post.deleteOne({ _id : id });
}

function getUserDetails (id)
{
    return User.findOne( { _id : id });
}

function updateUser (id, setAttribute)
{
    return User.updateOne( { _id : id }, 
        {
            $set : setAttribute
        }
    )
}

function getMainCategories ()
{
    return MainCategory.find({}).select({ name : 1 });
}


const adminController = {
    async show(req, res) {
        // res.render('adminMain');
        res.render('adminMain');
    },

    async showUserList (req, res) {
        try
        {
            list = await getUsers(0, 0);
            // render here
            res.locals.parameters = {
                userList : list,
                delete : req.query.delete,
                update : req.query.update,
            }
            res.render('adminUser');
        }
        catch (error)
        {
            console.error(error);
            res.redirect('/admin');
        }
    },

    async showPostList (req, res) {
        try
        {
            list = await getPosts(0, 0);
            // render here
            console.log(list);
            res.send(list);
        }
        catch (error)
        {
            console.error(error);
        }
    },

    async showUserDetails (req, res) {
        const id = req.query.id;
        try
        {
            queries = {
                item : await getUserDetails(id),
                availableCategories : await getMainCategories(),
            }
            res.locals.parameters = {
                user : queries.item,
                categories : queries.availableCategories,
                notFound : queries.item === null,
            };
            res.render('adminUserDetails');
        }
        catch (error)
        {
            console.error(error);
            res.redirect('/admin/users');
        }
    },

    async removeUser (req, res) {
        const id = req.body.userID;

        try
        {
            item = await getUserDetails(id);
            if (item === null)
            {
                res.locals.parameters = {
                    title : 'Không tìm thấy user',
                    action : false,
                }
                res.render('adminError');
                return;
            }
            if (item.type === 'admin')
            {
                res.locals.parameters = {
                    title : 'Không thể chỉnh sửa user này',
                    action : false,
                }
                res.render('adminError');
                return;
            }
            result = await deleteUser(id);
            if (result.deletedCount === 1)
            {
                res.redirect('/admin/users?delete=success');
            }
            else
            {
                res.redirect('/admin/users?delete=failure');
            }
        }
        catch (error)
        {
            console.error(error);
            res.redirect('/admin/users');
        }
    },

    async editUser (req, res) {
        const body = req.body;
        const id = body.userID;
        const item = {
            fullName : body.fullName,
            dateOfBirth : body.dob,
            type : body.type,
            nickname : body.type === 'writer' ? body.nickname : null,
            idCategory : body.type === 'editor' ? body.category : null,
            remainingTime : body.type === 'subscriber' ? body.expire : null,
        };
        result = await updateUser(id, item);
        if (result.modifiedCount === 1)
        {
            res.redirect('/admin/users?update=success');
        }
        else
        {
            res.redirect('/admin/users?update=failure');
        }
    },
};

module.exports = adminController;
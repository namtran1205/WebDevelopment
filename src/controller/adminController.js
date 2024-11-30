const User = require('../models/User');
const Post = require('../models/Post');

// data fetch
function getUsers (limit, skip)
{
    limit = limit > 0 ? limit : 0; // 0 = no limit
    skip = skip > 0 ? skip : 0;

    return User.find({}).select({
        email : 1,
        fullName : 1,
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


const adminController = {
    async show(req, res) {
        res.render('adminPage');
    },
    async showUserList (req, res) {
        try
        {
        list = await getUsers(0, 0);
        // render here
        console.log(list);
        res.send(list);
        }
        catch (error)
        {
            console.error(error);
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
            item = await getUserDetails(id);
            console.log(item);
            res.send(item);
        }
        catch (error)
        {
            console.error(error);
        }
    },
};

module.exports = adminController;
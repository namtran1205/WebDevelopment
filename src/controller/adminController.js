const User = require('../models/User');
const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');
const insertUserService = require('../services/insertUser');

// data fetch
// users
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
function deleteUser (id)
{
    return User.deleteOne({ _id : id });
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

// posts
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
function deletePost (id)
{
    return Post.deleteOne({ _id : id });
}

// categories
function getMainCategories ()
{
    return MainCategory.find({}).select({ name : 1 });
}
async function deleteMainCategory (id)
{   
    return {
        updatePostResult : await Post.updateMany({ idMainCategory : id }, {
            $set : {
                idMainCategory : null,
                subCategory : null,
            }
        }),
        updateUserResult : await Post.updateMany( { 
            type : "editor",
            idCategory : id,
        }, {
            $set : {
                idCategory : null,
            }
        }),
        deleteResult : await MainCategory.deleteOne({ _id : id }),
    }
}
async function existsCategory (name)
{
    const query = await MainCategory.findOne({name : name});
    return query !== null;
}
async function insertCategory (name)
{
    const unavailableID = []
    for (let i = 0; i < 100; i++)
    {
        id = Math.floor(Math.random() * 10000000000);
        if (unavailableID.includes(id))
            id += 1;
        const newCategory = {
            _id : id.toString(),
            name : name,
            posts : [],
        };
        try
        {
            result = await MainCategory.insertMany([newCategory]);
            return result;
        }
        catch (error)
        {
            unavailableID.push(id);
        }
    }

    return null;
}
function updateCategory (id, name)
{
    //// change name
}

function getCategoryByID (id)
{
    return MainCategory.findOne({_id : id});
}
function getSubcategories (idMainCategory)
{
    return Post.distinct("subCategory", {idMainCategory : idMainCategory});
}
function deleteSubcategory (idMainCategory, name)
{
    //// delete subcat  
}

const adminController = {
    async show(req, res) {
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

    async createUser (req, res) {
        const { fail, result } = await insertUserService.insertUser(req.body);
        if (fail)
        {
            console.error(result);
            res.redirect('/admin/users?create=failure');
        }
        else
        {
            res.redirect('/admin/users?create=success');
        }
    },

    async showCreatePage (req, res) {
        
        try
        {
            const query = await getMainCategories();
            res.locals.parameters = {
                categories : query
            }
            res.render('adminCreate');
        }
        catch(error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Không thể kết nối với cơ sở dữ liệu.",
            }
            res.render('adminError');
        }
    },

    async showMainCategoryList (req, res) {
        try
        {
            categories = await getMainCategories();
            res.locals.parameters = {
                categories : categories,
                delete : req.query.delete,
                create : req.query.create,
            }
            res.render('adminCategory');
        }
        catch(error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Không thể kết nối với cơ sở dữ liệu.",
            }
            res.render('adminError');
        }
    },

    async removeCategory (req, res) {
        try
        {
            result = await deleteMainCategory(req.body._id);
            if (result.deleteResult.deletedCount === 1)
            {
                res.redirect('/admin/categories?delete=success');
            }
            else
            {
                res.redirect('/admin/categories?delete=failure')
            }
        }
        catch (error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Lỗi kết nối cơ sở dữ liệu",
                action : false,
            };
            res.render('adminError');
        }
    },

    async checkCategory (req, res) {
        const name = req.query.name;
        exist = await existsCategory(name);
        return res.json(exist);
    },

    async createCategory (req, res) {
        const name = req.body.name;
        if (!name)
            res.redirect('/admin/categories?create=failure');
        const query = await insertCategory(name);
        if (query !== null && query.length > 0)
            res.redirect('/admin/categories?create=success');
        else
            res.redirect('/admin/categories?create=failure');
    },

    async showSubcategoryList (req, res) {
        const idMain = req.query.id;
        if (!idMain)
            res.redirect('/admin/categories');

        try
        {
            const category = await getCategoryByID(idMain);
            if (category === null)
                res.redirect('/admin/categories');
            const subcategories = await getSubcategories(idMain);
            res.locals.parameters = {
                category : category,
                subcategories : subcategories,
                delete : req.query.delete,
                update : req.query.update,
            };
            res.render('adminSubcategory');
        }
        catch (error)
        {
            console.error(error)
            res.locals.parameters = {
                title : "Lỗi kết nối cơ sở dữ liệu",
                action : false,
            };
            res.render('adminError');
        }
    }
};

module.exports = adminController;
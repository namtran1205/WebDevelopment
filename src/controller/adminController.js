const User = require('../models/User');
const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');
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
function getPosts () // (limit, skip)
{
    // limit = limit > 0 ? limit : 0; // 0 = no limit
    // skip = skip > 0 ? skip : 0;

    return Post.aggregate([
        {
            $project : {
                title : 1,
                abstract : 1,
                idMainCategory : 1,
                subCategory : 1,
                idWriter : 1,
                state : 1,
            }
        },
        {
            $lookup : {
                from : "maincategories",
                localField : "idMainCategory",
                foreignField : "_id",
                as : "categoryRef",
            }
        },
        {
            $replaceRoot : {
                newRoot : {
                    $mergeObjects : [{ $arrayElemAt : ["$categoryRef", 0] }, "$$ROOT"]
                }
            }
        },
        {
            $project : {
                title : 1,
                abstract : 1,
                subCategory : 1,
                idWriter : 1,
                name : 1,
                state : 1,
            }
        },
        {
            $addFields : {
                objUser : {
                    $toObjectId : "$idWriter"
                }
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "objUser",
                foreignField : "_id",
                as : "writerRef",
            }
        },
        {
            $replaceRoot : {
                newRoot : {
                    $mergeObjects : [{ $arrayElemAt : ["$writerRef", 0] }, "$$ROOT"]
                }
            }
        },
        {
            $project : {
                title : 1,
                abstract : 1,
                subCategory : 1,
                name : 1,
                nickname : 1,
                state : 1,
            }
        }
    ])
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
    return MainCategory.updateOne({ _id : id}, {
        $set : {
            name : name,
        }
    })
}

// subcategories
function getCategoryByID (id)
{
    return MainCategory.findOne({_id : id});
}
function getSubcategories (idMainCategory)
{
    return Post.distinct("subCategory", {
        idMainCategory : idMainCategory,
        subCategory : { $ne : null }
    });
}
function deleteSubcategory (idMainCategory, name)
{
    return Post.updateMany({ 
        idMainCategory : idMainCategory,
        subCategory : name,
     }, {
        $set : {
            subCategory : null,
        }
    });
}

// tags
function getTags ()
{
    return Tag.find({}).select({ name : 1 });
}
async function existsTag (name)
{
    const query = await Tag.findOne({ name : name });
    return query !== null;
}
function insertTag (name) 
{
    return Tag.insertMany([{
        name : name,
    }]);
}
async function deleteTag (id)
{
    return {
        updateResult : await Post.updateMany(
            {},
            {
                $pull : {
                    tags : id,
                }
            }
        ),
        deleteResult : await Tag.deleteOne({ _id : id }),
    };
}
function getTagByID (id)
{
    return Tag.findOne({ _id : id }).select({ name : 1 });
}
function updateTag (id, name)
{
    return Tag.updateOne({ _id : id }, {
        $set : {
            name : name,
        },
    });
}
function getPostByTag (tagID)
{
    return Post.find({ tags : tagID }).select({
        title : 1,
    });
}
function pullTagFromPost (postId, tagID)
{
    return Post.updateOne({_id : postId}, {
        $pull : {
            tags : tagID,
        }
    });
}
function publishPost (id)
{
    return Post.updateOne({ _id : id }, {
        $set : {
            state : "Đã xuất bản",
            publishedDate : new Date(),
        }
    })
}

const adminController = {
    async show(req, res) {
        res.render('admin/adminMain');
    },

    async showUserList (req, res) {
        try
        {
            list = await getUsers(0, 0);
            res.locals.parameters = {
                userList : list,
                delete : req.query.delete,
                update : req.query.update,
                create : req.query.create,
            }
            res.render('admin/adminUser');
        }
        catch (error)
        {
            console.error(error);
            res.redirect('/admin');
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
            res.render('admin/adminUserDetails');
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
                res.render('admin/adminError');
                return;
            }
            if (item.type === 'admin')
            {
                res.locals.parameters = {
                    title : 'Không thể chỉnh sửa user này',
                    action : false,
                }
                res.render('admin/adminError');
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
            res.render('admin/adminCreate');
        }
        catch(error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Không thể kết nối với cơ sở dữ liệu.",
            }
            res.render('admin/adminError');
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
            res.render('admin/adminCategory');
        }
        catch(error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Không thể kết nối với cơ sở dữ liệu.",
            }
            res.render('admin/adminError');
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
            res.render('admin/adminError');
        }
    },

    async checkCategory (req, res) {
        const name = req.query.name;
        const exist = await existsCategory(name);
        return res.json(exist);
    },

    async createCategory (req, res) {
        const name = req.body.name;
        if (!name)
        {
            res.redirect('/admin/categories?create=failure');
            return;
        }

        try
        {
            const query = await insertCategory(name);
            if (query !== null && query.length > 0)
                res.redirect('/admin/categories?create=success');
            else
                res.redirect('/admin/categories?create=failure');
        }
        catch (error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Lỗi từ cơ sở dữ liệu",
                action : false,
            };
            res.render('adminError');
        }
    },

    async showSubcategoryList (req, res) {
        const idMain = req.query.id;
        if (!idMain)
        {
            res.redirect('/admin/categories');
            return;
        }

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
            res.render('admin/adminSubcategory');
        }
        catch (error)
        {
            console.error(error)
            res.locals.parameters = {
                title : "Lỗi kết nối cơ sở dữ liệu",
                action : false,
            };
            res.render('admin/adminError');
        }
    },

    async editMainCategory (req, res) {
        const {_id, name} = req.body;
        try
        {
            const query = await updateCategory(_id, name);
            if (query.modifiedCount === 0)
            {
                res.redirect(`/admin/subcategories?id=${_id}&update=failure`);
            }
            else
            {
                res.redirect(`/admin/subcategories?id=${_id}&update=success`);
            }
        }
        catch (error)
        {
            console.error(error);
            res.redirect(`/admin/subcategories?id=${_id}&update=failure`);
        }
    },

    async removeSubcategory (req, res) {
        const {idMainCategory, name} = req.body;
        try
        {
            const query = await deleteSubcategory(idMainCategory, name);
            if (query.modifiedCount === 0)
                res.redirect(`/admin/subcategories?id=${idMainCategory}&delete=failure`);
            else
                res.redirect(`/admin/subcategories?id=${idMainCategory}&delete=success`);
        }
        catch (error)
        {
            console.error(error);
            res.redirect
        }
    },

    async showTagList (req, res) {
        try
        {
            const tags = await getTags();
            res.locals.parameters = {
                tags : tags,
                delete : req.query.delete,
                create : req.query.create,
            };
            res.render('admin/adminTag');
        }
        catch (error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Lỗi kết nối cơ sở dữ liệu",
                action : false,
            };
            res.render('admin/adminError');
        }
    },

    async checkTag (req, res) {
        const name = req.query.name;
        const exist = await existsTag(name);
        return res.json(exist);
    },

    async createTag (req, res) {
        const name = req.body.name;
        if (!name)
        {
            res.redirect('/admin/tags?create=failure');
            return;
        }
        try
        {
            const query = await insertTag(name);
            if (query !== null && query.length > 0)
                res.redirect('/admin/tags?create=success');
            else
                res.redirect('/admin/tags?create=failure');
        }
        catch (error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Lỗi từ cơ sở dữ liệu",
                action : false,
            };
            res.render('adminError');
        }
    },

    async removeTag (req, res) {
        const id = req.body._id
        if (!id)
        {
            res.redirect('/admin/tags?delete=failure');
            return;
        }
        try
        {
            const queries = await deleteTag (id);
            if (queries.deleteResult.deletedCount > 0)
                res.redirect('/admin/tags?delete=success');
            else
                res.redirect('/admin/tags?delete=failure');
        }
        catch (error)
        {
            console.error(error);
            res.redirect('/admin/tags?delete=failure');
        }
    },

    async showTagDetails (req, res) {
        const id = req.query.id;
        if (!id)
        {
            res.redirect('/admin/tags');
            return;
        }
        
        try
        {
            const queries = {
                tag : await getTagByID(id),
                posts : await getPostByTag(id),
            };
            if (queries.tag === null)
            {
                res.redirect('/admin/tags');
                return;
            }

            res.locals.parameters = {
                tag : queries.tag,
                posts : queries.posts,
                delete : req.query.delete,
                update : req.query.update,
            };
            res.render('admin/adminTagDetails');
        }
        catch (error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Không thể lấy dữ liệu",
            };
            res.render('admin/adminError');
        }
    },

    async changeTag (req, res) {
        const {_id, name} = req.body;
        try
        {
            const query = await updateTag(_id, name);
            if (query.modifiedCount === 0)
                res.redirect(`/admin/tags/details?id=${_id}&update=failure`);
            else
                res.redirect(`/admin/tags/details?id=${_id}&update=success`);
        }
        catch (error)
        {
            res.locals.parameters = {
                title : "Lỗi khi kết nối cơ sở dữ liệu",
                action : false,
            };
            res.render('admin/adminError');
        }
    },

    async dropTag (req, res) {
        const {tagID, postID} = req.body;
        try
        {
            const query = await pullTagFromPost(postID, tagID);
            if (query.modifiedCount === 0)
                res.redirect(`/admin/tags/details?id=${tagID}&delete=failure`);
            else
                res.redirect(`/admin/tags/details?id=${tagID}&delete=success`);
        }
        catch (error)
        {
            res.locals.parameters = {
                title : "Lỗi khi kết nối cơ sở dữ liệu",
                action : false,
            };
            res.render('admin/adminError');
        }
    },

    async showPostList (req, res) {
        try
        {
            const posts = await getPosts();
            res.locals.parameters = {
                posts : posts,
                delete : req.query.delete,
                publish : req.query.publish,
            }
            res.render('admin/adminPost');
        }
        catch (error)
        {
            console.error(error);
            res.locals.parameters = {
                title : "Lỗi khi kết nối cơ sở dữ liệu",
            };
            res.render('admin/adminError');
        }
    },

    async removePost (req, res) {
        const id = req.body._id;
        if (!id)
        {
            res.redirect('/admin/posts?delete=failure');
            return;
        }
        try
        {
            const query = await deletePost(id);
            if (query.deletedCount === 0)
                res.redirect('admin/posts?delete=failure');
            else
                res.redirect('/admin/posts?delete=success');
        }
        catch (error)
        {
            console.error(error);
            res.redirect('/admin/posts?delete=failure');
        }
    },

    async approvePost (req, res) {
        const id = req.body._id;
        if (!id)
        {
            res.redirect('/admin/posts?publish=failure');
            return;
        }
        try
        {
            const query = await publishPost(id);
            if (query.modifiedCount === 0)
                res.redirect('/admin/posts?publish=failure');
            else
                res.redirect('/admin/posts?publish=success');
        }
        catch (error)
        {
            console.error(error);
            res.redirect('/admin/posts?publish=failure');
        }
    }
};

module.exports = adminController;
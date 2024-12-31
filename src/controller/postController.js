const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');
const Tag = require('../models/Tag');

class getPosts {
    getListPosts = async (req, res) => {
        console.time('Data Fetching');
        const page = parseInt(req.query.page) || 1;
        const pageSize = 8;
        const skip = (page - 1) * pageSize;
        const id = req.params.id;
        const isCategoryPage = req.originalUrl.includes('/category/');
        const isTagPage = req.originalUrl.includes('/tag/');
        const isSubCategoryPage = req.originalUrl.includes('/subcategory/');
        
        try {
            let filter = { state: "Đã xuất bản" };

            if (isCategoryPage) {
                filter.idMainCategory = id;
            } else if (isTagPage) {
                filter.tags = { $in: id };
            } else if (isSubCategoryPage) {
                filter.subCategory = id;
            }
            const tags = await Tag.find({});
            // Fetch posts with pagination and sort
            const [posts, totalPosts] = await Promise.all([
                Post.find(filter)
                    .select("title abstract subCategory tags image publishedDate idMainCategory type")
                    .skip(skip)
                    .limit(pageSize)
                    .sort({type: -1, publishedDate: -1}),
                Post.countDocuments(filter),
            ]);

            const totalPage = Math.ceil(totalPosts / pageSize);

            // Fetch associated tags and categories in one go
            const tagIds = [...new Set(posts.flatMap(post => post.tags))];
            const categoryIds = [...new Set(posts.map(post => post.idMainCategory))];

            const [categories] = await Promise.all([
                MainCategory.find({ _id: { $in: categoryIds } }),
            ]);

            // Map tag names and categories to posts
            const tagsMap = tags.reduce((acc, tag) => {
                acc[tag._id] = tag.name;
                return acc;
            }, {});
            const categoriesMap = categories.reduce((acc, category) => {
                acc[category._id] = category.name;
                return acc;
            }, {});

            const postsWithDetails = posts.map(post => ({
                ...post._doc,
                tagNames: post.tags.map(tagId => tagsMap[tagId]),
                categories: categoriesMap[post.idMainCategory] || null,
            }));
            // Update tag and category post references in bulk
            await Promise.all([
                Tag.updateMany({ _id: { $in: tagIds } }, { $addToSet: { posts: { $each: posts.map(post => post._id) } } }),
                MainCategory.updateMany({ _id: { $in: categoryIds } }, { $addToSet: { posts: { $each: posts.map(post => post._id) } } }),
            ]);

            console.timeEnd('Data Fetching');
            
            res.render('listItem', {
                posts: postsWithDetails,
                tags,
                currentPage: page,
                id,
                isCategoryPage,
                isTagPage,
                isSubCategoryPage,
                totalPage,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi lấy danh sách bài viết',
            });
        }
        
    };
}

module.exports = new getPosts();

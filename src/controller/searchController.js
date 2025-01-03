const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q || "";
    const category = req.query.category || "";
    const searchField = req.query.searchField || "all"; 

    console.log("Search Field:", searchField);

    const searchCondition = {
      state: "Đã xuất bản" 
    };

    if (category) {
      const mainCategory = await MainCategory.findOne({ name: category }).select('_id').lean();
      if (mainCategory) {
        searchCondition.idMainCategory = mainCategory._id;
      }
    }

    
    if (query) {
      if (searchField === "title") {
        searchCondition.title = { $regex: query, $options: "i" };
      } else if (searchField === "abstract") {
        searchCondition.abstract = { $regex: query, $options: "i" }; 
      } else if (searchField === "content") {
        searchCondition.content = { $regex: query, $options: "i" };
      } else {
        searchCondition.$text = { $search: query }; 
      }
    }

    const results = await Post.find(searchCondition)
      .select('title abstract content image type idMainCategory publishedDate')
      .lean();

    const mainCategoryIds = [...new Set(results.map(post => post.idMainCategory))];
    const mainCategories = await MainCategory.find({ _id: { $in: mainCategoryIds } })
      .select('_id name')
      .lean();

    const categoryMap = mainCategories.reduce((map, category) => {
      map[category._id] = category.name;
      return map;
    }, {});

    results.forEach(post => {
      post.categoryName = categoryMap[post.idMainCategory] || "Không xác định";
    });

    res.render('searchResults', { results, query, category, searchField });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ!');
  }
};


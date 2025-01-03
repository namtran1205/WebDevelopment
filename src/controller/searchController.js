const Post = require('../models/Post');
const MainCategory = require('../models/MainCategory');

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q || "";
    const category = req.query.category || ""; 
    console.log("XINCHAOCANHA");
    console.log(category);

    let categoryId = "";
    if (category) {
      const mainCategory = await MainCategory.findOne({ name: category }).select('_id').lean();
      if (mainCategory) {
        categoryId = mainCategory._id; 
      } else {
        console.log(`Không tìm thấy chuyên mục với tên: ${category}`);
      }
    }

    const searchCondition = {
      $text: { $search: query },
      state: "Đã xuất bản" 
    };

    if (categoryId) {
      searchCondition.idMainCategory = categoryId;
    }

    const results = await Post.find(searchCondition, { score: { $meta: "textScore" } }) 
      .select('title abstract content image type idMainCategory publishedDate score') 
      .sort({ score: { $meta: "textScore" }, publishedDate: -1 }) 
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

    console.log(results);
    console.log("XINCHAOCANHA");
    console.log(category);
    res.render('searchResults', { results, query, category });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ!');
  }
};

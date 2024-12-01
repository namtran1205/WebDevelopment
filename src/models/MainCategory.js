const mongoose = require('mongoose');

const MainCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ]
});

const MainCategory = mongoose.model('MainCategory', MainCategorySchema);

module.exports = MainCategory;

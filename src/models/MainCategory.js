const mongoose = require('mongoose');

const MainCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    _id: {
        type: String,
        require: true
    }
})

const MainCategory = mongoose.model('MainCategory', MainCategorySchema);

module.exports = MainCategory;

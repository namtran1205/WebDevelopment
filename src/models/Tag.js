const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    idPost: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
})

const Tag = mongoose.model('Tag', TagSchema)

module.exports = Tag;
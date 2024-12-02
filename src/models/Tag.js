const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
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

const Tag = mongoose.model('Tag', TagSchema)

module.exports = Tag;
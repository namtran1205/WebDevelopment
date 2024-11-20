const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect("mongodb+srv://tri:123@webdevelopmentdb.g0uza.mongodb.net/?retryWrites=true&w=majority&appName=WebDevelopmentDB")
}

module.exports = connectDB
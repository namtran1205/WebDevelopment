const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: 
    { 
        type: String, 
        required: true 
    },
    message: 
    { 
        type: String, 
        required: true 
    },
    date: 
    { 
        type: Date, 
        default: Date.now 
    },
    isRead: 
    { 
        type: Boolean, 
        default: false 
    },
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;

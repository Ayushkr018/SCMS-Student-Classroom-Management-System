/**
 * User Notification Model
 * Joins users and notifications to track individual read status.
 */

const mongoose = require('mongoose');

const userNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        required: true
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: {
        type: Date,
    },
    channel: {
        type: String,
        enum: ['in_app', 'email', 'push', 'sms'],
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'failed'],
        default: 'sent'
    }
}, {
    timestamps: true,
});

// Compound index for efficient querying of a user's notifications
userNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);

module.exports = UserNotification;

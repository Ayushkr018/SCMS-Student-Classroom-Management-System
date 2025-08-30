/**
 * Notification Controller
 * Handles fetching and managing user notifications
 */

const {
    Notification
} = require('../models');
const {
    catchAsync
} = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendPaginatedResponse,
    sendErrorResponse
} = require('../utils/response');

// A separate model to track user-specific notification status (e.g., isRead)
// is a more scalable approach than embedding read status in the main notification document.
// We will assume a UserNotification model exists for this controller.
const UserNotification = require('../models/UserNotification'); // Assuming this model exists

/**
 * Get notifications for the currently logged-in user
 */
const getMyNotifications = catchAsync(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status = 'all'
    } = req.query; // status can be 'all', 'read', or 'unread'

    const filter = {
        userId: req.user.id
    };
    if (status === 'read') {
        filter.isRead = true;
    } else if (status === 'unread') {
        filter.isRead = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [userNotifications, total] = await Promise.all([
        UserNotification.find(filter)
        .populate({
            path: 'notificationId',
            populate: {
                path: 'senderId',
                select: 'firstName lastName profileImage'
            }
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
        UserNotification.countDocuments(filter)
    ]);

    const notifications = userNotifications.map(un => ({
        ...un.notificationId,
        isRead: un.isRead,
        readAt: un.readAt,
        userNotificationId: un._id // ID of the user-notification link
    }));

    const unreadCount = await UserNotification.countDocuments({
        userId: req.user.id,
        isRead: false
    });

    sendPaginatedResponse(res, notifications, parseInt(page), parseInt(limit), total, 'Notifications retrieved successfully', {
        unreadCount
    });
});

/**
 * Mark a single notification as read
 */
const markAsRead = catchAsync(async (req, res) => {
    const {
        notificationId
    } = req.params; // This is the UserNotification ID

    const notification = await UserNotification.findOneAndUpdate({
        _id: notificationId,
        userId: req.user.id
    }, {
        isRead: true,
        readAt: new Date()
    }, {
        new: true
    });

    if (!notification) {
        return sendErrorResponse(res, 404, 'Notification not found or you do not have permission to view it.');
    }

    sendSuccessResponse(res, 200, 'Notification marked as read.');
});

/**
 * Mark all notifications as read for the current user
 */
const markAllAsRead = catchAsync(async (req, res) => {
    await UserNotification.updateMany({
        userId: req.user.id,
        isRead: false
    }, {
        isRead: true,
        readAt: new Date()
    });

    sendSuccessResponse(res, 200, 'All notifications marked as read.');
});


module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead
};

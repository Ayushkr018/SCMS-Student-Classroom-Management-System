/**
 * Notification Controller
 * Handles fetching and managing user notifications
 */

const { Notification, UserNotification } = require('../models');
const { catchAsync } = require('../middleware/errorHandler');
const { 
  sendSuccessResponse, 
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse
} = require('../utils/response');
const notificationService = require('../services/notificationService');

/**
 * Get all notifications for the current user
 */
const getMyNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { notifications, total } = await notificationService.getUserNotifications(req.user.id, { page, limit });

  sendPaginatedResponse(res, notifications, parseInt(page), parseInt(limit), total, 'Notifications retrieved successfully');
});

/**
 * Get the count of unread notifications for the current user
 */
const getUnreadCount = catchAsync(async (req, res) => {
  const count = await UserNotification.countDocuments({
    userId: req.user.id,
    isRead: false
  });
  
  sendSuccessResponse(res, 200, 'Unread notification count retrieved', { count });
});

/**
 * Mark a single notification as read
 */
const markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params; // This is the UserNotification ID

  const userNotification = await UserNotification.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!userNotification) {
    return sendErrorResponse(res, 404, 'Notification not found or you do not have permission to view it.');
  }

  sendSuccessResponse(res, 200, 'Notification marked as read');
});

/**
 * Mark all of the user's notifications as read
 */
const markAllAsRead = catchAsync(async (req, res) => {
  await UserNotification.updateMany(
    { userId: req.user.id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  sendSuccessResponse(res, 200, 'All notifications marked as read');
});

/**
 * Create and send a new notification (for admins/teachers)
 */
const createNotification = catchAsync(async (req, res) => {
    const notificationData = req.body;
    notificationData.senderId = req.user.id; // Set sender as the current user

    const notification = await notificationService.sendNotification(notificationData);
    
    sendCreatedResponse(res, notification, 'Notification sent successfully');
});

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification
};


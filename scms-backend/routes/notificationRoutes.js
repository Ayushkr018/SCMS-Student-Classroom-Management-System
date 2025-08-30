/**
 * Notification Routes
 * Endpoints for managing and viewing notifications
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const notificationController = require('../controllers/notificationController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../utils/constants');
const { validate } = require('../middleware/validation');
const { paramSchemas, notificationSchemas } = require('../middleware/validation');

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the current user
 * @access  Private
 */
router.get('/',
  authenticateJWT,
  notificationController.getMyNotifications
);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get the count of unread notifications
 * @access  Private
 */
router.get('/unread-count',
  authenticateJWT,
  notificationController.getUnreadCount
);

/**
 * @route   POST /api/notifications
 * @desc    Create and send a new notification (for admins/teachers)
 * @access  Private (Admin, Teacher)
 */
router.post('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(notificationSchemas.create, 'body'),
  notificationController.createNotification
);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private
 */
router.patch('/:id/read',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  notificationController.markAsRead
);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch('/read-all',
  authenticateJWT,
  notificationController.markAllAsRead
);

module.exports = router;


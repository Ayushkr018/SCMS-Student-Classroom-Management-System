/**
 * Notification Routes
 * Handles notification retrieval and management
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const notificationController = require('../controllers/notificationController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { notificationSchemas, paramSchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the current user (paginated)
 * @access  Private
 */
router.get('/',
  authenticateJWT,
  notificationController.getMyNotifications
);

/**
 * @route   POST /api/notifications
 * @desc    Create a new global notification
 * @access  Private (Admin)
 */
router.post('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(notificationSchemas.create, 'body'),
  notificationController.createNotification
);

/**
 * @route   POST /api/notifications/read/all
 * @desc    Mark all of the user's notifications as read
 * @access  Private
 */
router.post('/read/all',
  authenticateJWT,
  notificationController.markAllAsRead
);

/**
 * @route   POST /api/notifications/read/:id
 * @desc    Mark a specific notification as read
 * @access  Private
 */
router.post('/read/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  notificationController.markAsRead
);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(paramSchemas.id, 'params'),
  notificationController.deleteNotification
);

module.exports = router;

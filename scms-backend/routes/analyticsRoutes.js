/**
 * Analytics Routes
 * Endpoints for analytics and reporting
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../utils/constants');

// Secure all analytics routes
router.use(authenticateJWT);
router.use(authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER));

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard analytics
 * @access  Private (Admin, Teacher)
 */
router.get(
  '/dashboard',
  analyticsController.getDashboardStats
);

/**
 * @route   GET /api/analytics/course/:courseId
 * @desc    Get detailed course analytics
 * @access  Private (Admin, Teacher)
 */
router.get(
  '/course/:courseId',
  analyticsController.getCourseAnalytics
);

/**
 * @route   GET /api/analytics/system
 * @desc    Get system-wide performance analytics
 * @access  Private (Admin, Teacher)
 */
router.get(
  '/system',
  analyticsController.getSystemAnalytics
);

module.exports = router;


/**
 * Analytics Routes
 * Handles all analytics-related API endpoints
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const {
    protect,
    authorize
} = require('../middleware/authMiddleware');
const {
    USER_ROLES
} = require('../utils/constants');

// All analytics routes are protected and restricted to Admins and Teachers
router.use(protect);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.TEACHER));

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get high-level dashboard statistics
 * @access  Private (Admin, Teacher)
 */
router.get('/dashboard', analyticsController.getDashboardStats);

/**
 * @route   GET /api/analytics/summary
 * @desc    Get an overall summary of the system
 * @access  Private (Admin, Teacher)
 */
router.get('/summary', analyticsController.getOverallSummary);

/**
 * @route   GET /api/analytics/courses
 * @desc    Get detailed course-related analytics
 * @access  Private (Admin, Teacher)
 */
router.get('/courses', analyticsController.getCourseAnalytics);

/**
 * @route   GET /api/analytics/students
 * @desc    Get detailed student performance analytics
 * @access  Private (Admin, Teacher)
 */
router.get('/students', analyticsController.getStudentAnalytics);

/**
 * @route   GET /api/analytics/grades
 * @desc    Get detailed grade distribution and analytics
 * @access  Private (Admin, Teacher)
 */
router.get('/grades', analyticsController.getGradeAnalytics);

module.exports = router;

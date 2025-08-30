/**
 * Dashboard Routes
 * Provides endpoints for fetching role-specific dashboard data.
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/dashboard
 * @desc    Get dashboard data for the logged-in user
 * @access  Private
 */
router.get('/',
  authenticateJWT,
  dashboardController.getDashboardData
);

module.exports = router;

/**
 * Settings Routes
 * Handles global application settings
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const settingsController = require('../controllers/settingsController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { settingsSchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/settings
 * @desc    Get all application settings
 * @access  Private (Admin)
 */
router.get('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  settingsController.getSettings
);

/**
 * @route   PUT /api/settings
 * @desc    Update application settings
 * @access  Private (Admin)
 */
router.put('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(settingsSchemas.update, 'body'),
  settingsController.updateSettings
);

module.exports = router;

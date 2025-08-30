/**
 * User Routes
 * User management endpoints
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const userController = require('../controllers/userController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { userSchemas, querySchemas, paramSchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin, Teacher)
 */
router.get('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(querySchemas.userList, 'query'),
  userController.getAllUsers
);

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Private (All authenticated users)
 */
router.get('/search',
  authenticateJWT,
  userController.searchUsers
);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private (Admin only)
 */
router.get('/stats',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  userController.getUserStats
);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(userSchemas.register, 'body'),
  userController.createUser
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin, or own profile)
 */
router.get('/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  userController.getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin, or own profile)
 */
router.put('/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  validate(userSchemas.update, 'body'),
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(paramSchemas.id, 'params'),
  userController.deleteUser
);

/**
 * @route   PUT /api/users/:id/password
 * @desc    Update user password
 * @access  Private (Admin, or own profile)
 */
router.put('/:id/password',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  validate(userSchemas.changePassword, 'body'),
  userController.updatePassword
);

/**
 * @route   PUT /api/users/:id/profile
 * @desc    Update user profile (including role-specific data)
 * @access  Private (User can update own profile, Admin can update any)
 */
router.put('/:id/profile',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  userController.updateProfile
);

/**
 * @route   GET /api/users/:id/dashboard
 * @desc    Get user dashboard data
 * @access  Private (User can view own dashboard, Admin can view any)
 */
router.get('/:id/dashboard',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  userController.getDashboardData
);

module.exports = router;

/**
 * Authentication Routes
 * All authentication-related endpoints
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { userSchemas, commonSchemas } = require('../middleware/validation');
const rateLimiters = require('../middleware/rateLimiter');

// Apply rate limiting to all auth routes
router.use(rateLimiters.authLimiter);

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', 
  validate(userSchemas.register, 'body'),
  authController.register
);

/**
 * @route   POST /api/auth/login  
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  validate(userSchemas.login, 'body'),
  authController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh',
  authController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  authenticateJWT,
  authController.logout
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me',
  authenticateJWT,
  authController.getMe
);

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me',
  authenticateJWT,
  validate(userSchemas.update, 'body'),
  authController.updateMe
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password',
  authenticateJWT,
  validate(userSchemas.changePassword, 'body'),
  authController.changePassword
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password',
  validate(userSchemas.forgotPassword, 'body'),
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password',
  validate(userSchemas.resetPassword, 'body'),
  authController.resetPassword
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 */
router.post('/verify-email',
  authController.verifyEmail
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post('/resend-verification',
  validate(userSchemas.forgotPassword, 'body'), // Uses same validation as forgot password (email only)
  authController.resendVerificationEmail
);

module.exports = router;

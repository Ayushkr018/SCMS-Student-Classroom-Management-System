/**
 * Submission Routes
 * Handles submission-specific data retrieval
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const submissionController = require('../controllers/submissionController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { paramSchemas, querySchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/submissions/my-submissions
 * @desc    Get all submissions for the current student
 * @access  Private (Student)
 */
router.get('/my-submissions',
  authenticateJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  validate(querySchemas.list, 'query'),
  submissionController.getMySubmissions
);

/**
 * @route   GET /api/submissions/:id
 * @desc    Get a single submission by ID
 * @access  Private (Owner, Admin, Course Instructor)
 */
router.get('/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  submissionController.getSubmissionById
);

module.exports = router;

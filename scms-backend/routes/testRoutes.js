/**
 * Test Routes
 * Endpoints for the entire test lifecycle
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const testController = require('../controllers/testController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../utils/constants');
const { validate } = require('../middleware/validation');
const { paramSchemas, testSchemas } = require('../middleware/validation');

/**
 * @route   GET /api/tests
 * @desc    Get all tests with filtering
 * @access  Private
 */
router.get('/',
  authenticateJWT,
  testController.getAllTests
);

/**
 * @route   POST /api/tests
 * @desc    Create a new test
 * @access  Private (Admin, Teacher)
 */
router.post('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(testSchemas.create, 'body'),
  testController.createTest
);

/**
 * @route   GET /api/tests/:id
 * @desc    Get a single test by ID
 * @access  Private
 */
router.get('/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  testController.getTestById
);

/**
 * @route   PUT /api/tests/:id
 * @desc    Update a test
 * @access  Private (Admin, Test Creator)
 */
router.put('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  testController.updateTest
);

/**
 * @route   DELETE /api/tests/:id
 * @desc    Delete a test
 * @access  Private (Admin, Test Creator)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  testController.deleteTest
);

/**
 * @route   POST /api/tests/:id/start
 * @desc    Start a test attempt
 * @access  Private (Student)
 */
router.post('/:id/start',
    authenticateJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    validate(paramSchemas.id, 'params'),
    testController.startTest
);

/**
 * @route   POST /api/tests/submissions/:submissionId/submit
 * @desc    Submit a completed test
 * @access  Private (Student)
 */
router.post('/submissions/:submissionId/submit',
    authenticateJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    testController.submitTest
);

module.exports = router;


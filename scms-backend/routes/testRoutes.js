/**
 * Test Routes
 * Handles the entire test lifecycle from creation to submission and results
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const testController = require('../controllers/testController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { paramSchemas, querySchemas, testSchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/tests
 * @desc    Get all tests with filtering and pagination
 * @access  Private
 */
router.get('/',
  authenticateJWT,
  validate(querySchemas.list, 'query'),
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
    validate(testSchemas.update, 'body'),
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
 * @desc    Start a test session for the current student
 * @access  Private (Student)
 */
router.post('/:id/start',
  authenticateJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  validate(paramSchemas.id, 'params'),
  testController.startTest
);

/**
 * @route   POST /api/tests/:id/sessions/:sessionId/submit-answer
 * @desc    Submit an answer during a test session
 * @access  Private (Student)
 */
router.post('/:id/sessions/:sessionId/submit-answer',
  authenticateJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  validate(testSchemas.submitAnswer, 'body'),
  testController.submitAnswer
);

/**
 * @route   POST /api/tests/:id/sessions/:sessionId/submit
 * @desc    Submit the final test
 * @access  Private (Student)
 */
router.post('/:id/sessions/:sessionId/submit',
  authenticateJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  testController.submitTest
);

/**
 * @route   GET /api/tests/:id/results
 * @desc    Get results for a test
 * @access  Private
 */
router.get('/:id/results',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  testController.getTestResults
);

/**
 * @route   POST /api/tests/:id/questions
 * @desc    Add questions to a test
 * @access  Private (Admin, Test Creator)
 */
router.post('/:id/questions',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(testSchemas.addQuestions, 'body'),
  testController.addQuestions
);

/**
 * @route   DELETE /api/tests/:id/questions/:questionId
 * @desc    Remove a question from a test
 * @access  Private (Admin, Test Creator)
 */
router.delete('/:id/questions/:questionId',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  testController.removeQuestion
);

/**
 * @route   POST /api/tests/:id/publish
 * @desc    Publish a test to make it available
 * @access  Private (Admin, Test Creator)
 */
router.post('/:id/publish',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  testController.publishTest
);

console.log('testController.updateTest:', testController.updateTest);

module.exports = router;

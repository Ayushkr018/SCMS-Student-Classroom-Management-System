/**
 * Question Routes
 * Handles question bank management
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const questionController = require('../controllers/questionController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { questionSchemas, paramSchemas, querySchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/questions
 * @desc    Get all questions with filtering and pagination
 * @access  Private (Admin, Teacher)
 */
router.get('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(querySchemas.list, 'query'),
  questionController.getAllQuestions
);

/**
 * @route   POST /api/questions
 * @desc    Create a new question
 * @access  Private (Admin, Teacher)
 */
router.post('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(questionSchemas.create, 'body'),
  questionController.createQuestion
);

/**
 * @route   GET /api/questions/course/:courseId
 * @desc    Get all questions for a specific course
 * @access  Private (Admin, Teacher)
 */
router.get('/course/:courseId',
    authenticateJWT,
    authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
    validate(paramSchemas.courseId, 'params'),
    questionController.getQuestionsByCourse
);

/**
 * @route   GET /api/questions/random/course/:courseId
 * @desc    Get random questions for a specific course
 * @access  Private (Admin, Teacher)
 */
router.get('/random/course/:courseId',
    authenticateJWT,
    authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
    validate(paramSchemas.courseId, 'params'),
    questionController.getRandomQuestions
);

/**
 * @route   GET /api/questions/:id
 * @desc    Get a single question by ID
 * @access  Private (Admin, Teacher)
 */
router.get('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  questionController.getQuestionById
);

/**
 * @route   PUT /api/questions/:id
 * @desc    Update a question by ID
 * @access  Private (Admin, Teacher)
 */
router.put('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  validate(questionSchemas.update, 'body'),
  questionController.updateQuestion
);

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question by ID
 * @access  Private (Admin, Teacher)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  questionController.deleteQuestion
);

module.exports = router;

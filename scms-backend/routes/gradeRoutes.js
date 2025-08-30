/**
 * Grade Routes
 * Handles grade management and retrieval
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const gradeController = require('../controllers/gradeController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { gradeSchemas, paramSchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/grades
 * @desc    Get all grades (with filtering)
 * @access  Private (Admin, Teacher)
 */
router.get('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  gradeController.getAllGrades
);

/**
 * @route   POST /api/grades
 * @desc    Create a new grade
 * @access  Private (Admin, Teacher)
 */
router.post('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(gradeSchemas.create, 'body'),
  gradeController.createGrade
);

/**
 * @route   GET /api/grades/my-grades
 * @desc    Get grades for the logged-in student
 * @access  Private (Student)
 */
router.get('/my-grades',
  authenticateJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  gradeController.getMyGrades
);

/**
 * @route   GET /api/grades/course/:courseId
 * @desc    Get all grades for a specific course
 * @access  Private (Admin, Teacher)
 */
router.get('/course/:courseId',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.courseId, 'params'),
  gradeController.getCourseGrades
);

/**
 * @route   GET /api/grades/course/:courseId/stats
 * @desc    Get grade statistics for a course
 * @access  Private (Admin, Teacher)
 */
router.get('/course/:courseId/stats',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.courseId, 'params'),
  gradeController.getCourseGradeStats
);

/**
 * @route   GET /api/grades/:id
 * @desc    Get a single grade by ID
 * @access  Private (Admin, Teacher, Student owner)
 */
router.get('/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  gradeController.getGradeById
);

/**
 * @route   PUT /api/grades/:id
 * @desc    Update a grade
 * @access  Private (Admin, Teacher)
 */
router.put('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  validate(gradeSchemas.update, 'body'),
  gradeController.updateGrade
);

/**
 * @route   DELETE /api/grades/:id
 * @desc    Delete a grade
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(paramSchemas.id, 'params'),
  gradeController.deleteGrade
);

/**
 * @route   POST /api/grades/release
 * @desc    Release multiple grades to students
 * @access  Private (Admin, Teacher)
 */
router.post('/release',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(gradeSchemas.release, 'body'),
  gradeController.releaseGrades
);


module.exports = router;

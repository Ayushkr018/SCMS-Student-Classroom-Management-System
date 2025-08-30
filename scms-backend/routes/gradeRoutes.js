/**
 * Grade Routes
 * Endpoints for managing and viewing grades
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');

// Import controllers and middleware
const gradeController = require('../controllers/gradeController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../utils/constants');
const { validate } = require('../middleware/validation');
const { commonSchemas } = require('../middleware/validation');


/**
 * @route   GET /api/grades
 * @desc    Get all grades (admin view)
 * @access  Private (Admin)
 */
router.get('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  gradeController.getAllGrades
);

/**
 * @route   GET /api/grades/course/:courseId/stats
 * @desc    Get grade statistics for a specific course
 * @access  Private (Admin, Teacher)
 */
router.get(
  '/course/:courseId/stats',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(Joi.object({ courseId: commonSchemas.objectId.required() }), 'params'), // Correctly validates 'courseId'
  gradeController.getCourseGradeStatistics
);

/**
 * @route   GET /api/grades/student/:studentId/course/:courseId
 * @desc    Get all grades for a student in a specific course
 * @access  Private (Admin, Teacher, Student owner)
 */
router.get(
  '/student/:studentId/course/:courseId',
  authenticateJWT,
  // Additional authorization would be needed here
  gradeController.getStudentGradesForCourse
);

/**
 * @route   POST /api/grades
 * @desc    Manually create a new grade
 * @access  Private (Admin, Teacher)
 */
router.post('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  gradeController.createGrade
);

/**
 * @route   GET /api/grades/:id
 * @desc    Get a single grade by its ID
 * @access  Private
 */
router.get(
    '/:id',
    authenticateJWT,
    gradeController.getGradeById
);

/**
 * @route   PUT /api/grades/:id
 * @desc    Update a grade
 * @access  Private (Admin, Teacher)
 */
router.put('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  gradeController.updateGrade
);

/**
 * @route   DELETE /api/grades/:id
 * @desc    Delete a grade
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  gradeController.deleteGrade
);

module.exports = router;


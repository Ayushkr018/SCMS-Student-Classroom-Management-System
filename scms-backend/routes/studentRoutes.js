/**
 * Student Routes
 * Handles student-specific data management
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const studentController = require('../controllers/studentController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { paramSchemas, querySchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/students
 * @desc    Get all students with filtering and pagination
 * @access  Private (Admin, Teacher)
 */
router.get('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(querySchemas.list, 'query'),
  studentController.getAllStudents
);

/**
 * @route   GET /api/students/:id
 * @desc    Get a single student by their profile ID
 * @access  Private (Admin, Teacher, Student Owner)
 */
router.get('/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  studentController.getStudentById
);

/**
 * @route   PUT /api/students/:id
 * @desc    Update a student's profile
 * @access  Private (Admin)
 */
router.put('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(paramSchemas.id, 'params'),
  studentController.updateStudent
);

/**
 * @route   DELETE /api/students/:id
 * @desc    Deactivate a student's profile (soft delete)
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(paramSchemas.id, 'params'),
  studentController.deleteStudent
);

/**
 * @route   GET /api/students/:studentId/grades
 * @desc    Get a student's grades
 * @access  Private (Admin, Student Owner)
 */
router.get('/:studentId/grades',
  authenticateJWT,
  validate(paramSchemas.studentId, 'params'),
  studentController.getStudentGrades
);

/**
 * @route   GET /api/students/:studentId/enrollments
 * @desc    Get a student's course enrollments
 * @access  Private (Admin, Student Owner)
 */
router.get('/:studentId/enrollments',
  authenticateJWT,
  validate(paramSchemas.studentId, 'params'),
  studentController.getStudentEnrollments
);

module.exports = router;

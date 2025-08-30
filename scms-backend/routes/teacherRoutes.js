/**
 * Teacher Routes
 * Handles teacher-specific data management
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const teacherController = require('../controllers/teacherController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { paramSchemas, querySchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/teachers
 * @desc    Get all teachers with filtering and pagination
 * @access  Private (Admin)
 */
router.get('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(querySchemas.list, 'query'),
  teacherController.getAllTeachers
);

/**
 * @route   GET /api/teachers/:id
 * @desc    Get a single teacher by their profile ID
 * @access  Private (Admin, Teacher Owner)
 */
router.get('/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  teacherController.getTeacherById
);

/**
 * @route   PUT /api/teachers/:id
 * @desc    Update a teacher's profile
 * @access  Private (Admin, Teacher Owner)
 */
router.put('/:id',
  authenticateJWT,
  validate(paramSchemas.id, 'params'),
  teacherController.updateTeacher
);

/**
 * @route   DELETE /api/teachers/:id
 * @desc    Deactivate a teacher's profile (soft delete)
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(paramSchemas.id, 'params'),
  teacherController.deleteTeacher
);

/**
 * @route   GET /api/teachers/:teacherId/courses
 * @desc    Get a teacher's assigned courses
 * @access  Private (Admin, Teacher Owner)
 */
router.get('/:teacherId/courses',
  authenticateJWT,
  validate(paramSchemas.teacherId, 'params'),
  teacherController.getTeacherCourses
);

/**
 * @route   GET /api/teachers/:teacherId/assignments
 * @desc    Get all assignments created by a specific teacher
 * @access  Private (Admin, Teacher Owner)
 */
router.get('/:teacherId/assignments',
    authenticateJWT,
    validate(paramSchemas.teacherId, 'params'),
    teacherController.getTeacherAssignments
);


module.exports = router;

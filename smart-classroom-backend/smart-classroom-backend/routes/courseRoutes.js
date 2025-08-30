/**
 * Course Routes
 * Course management endpoints
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const courseController = require('../controllers/courseController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { courseSchemas, querySchemas, paramSchemas } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');

/**
 * @route   GET /api/courses
 * @desc    Get all courses with filtering and pagination
 * @access  Public (for published courses), Private (for all courses)
 */
router.get('/',
  validate(querySchemas.list, 'query'),
  courseController.getAllCourses
);

/**
 * @route   GET /api/courses/available
 * @desc    Get available courses for registration
 * @access  Private (Students)
 */
router.get('/available',
  authenticateJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  courseController.getAvailableCourses
);

/**
 * @route   GET /api/courses/my-courses
 * @desc    Get user's courses (enrolled for students, assigned for teachers)
 * @access  Private
 */
router.get('/my-courses',
  authenticateJWT,
  courseController.getMyCourses
);

/**
 * @route   POST /api/courses
 * @desc    Create new course
 * @access  Private (Admin, Teacher)
 */
router.post('/',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(courseSchemas.create, 'body'),
  courseController.createCourse
);

/**
 * @route   GET /api/courses/:id
 * @desc    Get course by ID
 * @access  Public (for published), Private (for all)
 */
router.get('/:id',
  validate(paramSchemas.id, 'params'),
  courseController.getCourseById
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private (Admin, Course Instructor)
 */
router.put('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  validate(courseSchemas.update, 'body'),
  courseController.updateCourse
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private (Admin only)
 */
router.delete('/:id',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(paramSchemas.id, 'params'),
  courseController.deleteCourse
);

/**
 * @route   POST /api/courses/:id/enroll
 * @desc    Enroll in course
 * @access  Private (Students)
 */
router.post('/:id/enroll',
  authenticateJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  validate(paramSchemas.id, 'params'),
  courseController.enrollInCourse
);

/**
 * @route   DELETE /api/courses/:id/enroll
 * @desc    Drop from course
 * @access  Private (Students)
 */
router.delete('/:id/enroll',
  authenticateJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  validate(paramSchemas.id, 'params'),
  courseController.dropFromCourse
);

/**
 * @route   GET /api/courses/:id/students
 * @desc    Get enrolled students
 * @access  Private (Admin, Course Instructor)
 */
router.get('/:id/students',
  authenticateJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  validate(paramSchemas.id, 'params'),
  courseController.getEnrolledStudents
);

module.exports = router;

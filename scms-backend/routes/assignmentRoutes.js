/**
 * Assignment Routes
 * Complete assignment lifecycle management
 */

const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { USER_ROLES } = require('../utils/constants');
const fileService = require('../services/fileService');

// Configure multer for file uploads
const upload = fileService.configureMulter({
  allowedTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png', 'zip'],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 5
});

/**
 * @route   GET /api/assignments
 * @desc    Get all assignments with filtering
 * @access  Private
 */
router.get('/', assignmentController.getAllAssignments);

/**
 * @route   POST /api/assignments
 * @desc    Create new assignment
 * @access  Private (Admin, Teacher)
 */
router.post('/',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  assignmentController.createAssignment
);

/**
 * @route   GET /api/assignments/:id
 * @desc    Get assignment by ID
 * @access  Private
 */
router.get('/:id', assignmentController.getAssignmentById);

/**
 * @route   PUT /api/assignments/:id
 * @desc    Update assignment
 * @access  Private (Admin, Assignment Creator)
 */
router.put('/:id',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  assignmentController.updateAssignment
);

/**
 * @route   DELETE /api/assignments/:id
 * @desc    Delete assignment
 * @access  Private (Admin, Assignment Creator)
 */
router.delete('/:id',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  assignmentController.deleteAssignment
);

/**
 * @route   POST /api/assignments/:id/submit
 * @desc    Submit assignment
 * @access  Private (Student)
 */
router.post('/:id/submit',
  authorizeRoles(USER_ROLES.STUDENT),
  upload.array('files'),
  assignmentController.submitAssignment
);

/**
 * @route   GET /api/assignments/:id/submissions
 * @desc    Get assignment submissions
 * @access  Private (Admin, Assignment Creator)
 */
router.get('/:id/submissions',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  assignmentController.getAssignmentSubmissions
);

/**
 * @route   POST /api/assignments/:id/submissions/:submissionId/grade
 * @desc    Grade submission
 * @access  Private (Admin, Assignment Creator)
 */
router.post('/:id/submissions/:submissionId/grade',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  assignmentController.gradeSubmission
);

module.exports = router;


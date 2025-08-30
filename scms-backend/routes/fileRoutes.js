/**
 * File Routes
 * Handles file uploads, downloads, and management
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const fileController = require('../controllers/fileController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../utils/constants');
const fileService = require('../services/fileService');

// Configure multer for general file uploads (e.g., assignment resources)
const upload = fileService.configureMulter({
  maxFileSize: 20 * 1024 * 1024, // 20MB
});

// Configure a specific multer instance for profile pictures
const uploadProfilePic = fileService.configureMulter({
  allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 1,
});

/**
 * @route   POST /api/files/upload
 * @desc    Upload one or more files
 * @access  Private
 */
router.post(
  '/upload',
  authenticateJWT,
  upload.array('files'), // Field name in the multipart/form-data
  fileController.uploadFiles
);

/**
 * @route   POST /api/files/upload/profile-picture
 * @desc    Upload a profile picture for the current user
 * @access  Private
 */
router.post(
  '/upload/profile-picture',
  authenticateJWT,
  uploadProfilePic.single('profilePicture'), // Field name for the profile picture
  fileController.uploadProfilePicture
);

/**
 * @route   GET /api/files/:filename
 * @desc    Get or download a file by its filename
 * @access  Private (Further checks should be done in the controller)
 */
router.get(
  '/:filename',
  authenticateJWT,
  fileController.getFile
);

/**
 * @route   DELETE /api/files/:id
 * @desc    Delete a file by its database ID
 * @access  Private (Admin or file owner)
 */
router.delete(
  '/:id',
  authenticateJWT,
  fileController.deleteFile
);

module.exports = router;

/**
 * File Routes
 * Endpoints for file management
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const fileController = require('../controllers/fileController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

/**
 * @route   POST /api/files/upload/public
 * @desc    Upload a public file
 * @access  Private
 */
router.post(
    '/upload/public',
    authenticateJWT,
    upload.single('file'), // Use 'file' as the field name
    fileController.uploadPublicFile
);

/**
 * @route   POST /api/files/upload/private
 * @desc    Upload a private file
 * @access  Private
 */
router.post(
    '/upload/private',
    authenticateJWT,
    upload.single('file'), // Use 'file' as the field name
    fileController.uploadPrivateFile
);

/**
 * @route   GET /api/files/view/:fileKey(*)
 * @desc    Get a file by its key (supports nested paths)
 * @access  Public/Private (handled by controller)
 */
router.get('/view/:fileKey(*)', fileController.getFile);


/**
 * @route   DELETE /api/files
 * @desc    Delete a file
 * @access  Private
 */
router.delete(
    '/',
    authenticateJWT,
    fileController.deleteFile
);

/**
 * @route   GET /api/files/stats
 * @desc    Get storage statistics
 * @access  Private (Admin)
 */
router.get(
    '/stats',
    authenticateJWT,
    authorizeRoles('admin'),
    fileController.getStorageStats
);

module.exports = router;


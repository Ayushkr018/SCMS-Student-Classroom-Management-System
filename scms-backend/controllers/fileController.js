/**
 * File Controller
 * Handles file upload, download, and deletion operations
 */

const fileService = require('../services/fileService');
const { catchAsync } = require('../middleware/errorHandler');
const { 
  sendSuccessResponse, 
  sendErrorResponse,
  sendCreatedResponse,
  sendDeletedResponse,
  sendNotFoundResponse 
} = require('../utils/response');

/**
 * Upload a single public file
 */
const uploadPublicFile = catchAsync(async (req, res) => {
  if (!req.file) {
    return sendErrorResponse(res, 400, 'No file uploaded.');
  }

  const fileData = await fileService.uploadFile(req.file, {
    folder: `public/${req.body.folder || 'general'}`,
    isPublic: true
  });

  sendCreatedResponse(res, fileData, 'File uploaded successfully.');
});

/**
 * Upload a single private file
 */
const uploadPrivateFile = catchAsync(async (req, res) => {
  if (!req.file) {
    return sendErrorResponse(res, 400, 'No file uploaded.');
  }

  const fileData = await fileService.uploadFile(req.file, {
    folder: `private/${req.user.id}/${req.body.folder || 'docs'}`,
    isPublic: false
  });

  sendCreatedResponse(res, fileData, 'Private file uploaded successfully.');
});

/**
 * Get a file (handles both public and private access)
 */
const getFile = catchAsync(async (req, res) => {
  const { fileKey } = req.params; // fileKey would be the full path in S3/local

  // In a real scenario, you'd check database records for file ownership
  // and determine if the file is public or if the user has access.
  
  const isPublic = fileKey.startsWith('public/');
  
  if(isPublic) {
    const fileUrl = fileService.useS3 
        ? `https://${fileService.bucketName}.s3.amazonaws.com/${fileKey}` 
        : `/uploads/${fileKey}`;
    return res.redirect(fileUrl);
  }
  
  // For private files, generate a signed URL
  const signedUrl = await fileService.getSignedUrl(fileKey);
  res.redirect(signedUrl);
});

/**
 * Delete a file
 */
const deleteFile = catchAsync(async (req, res) => {
  const { fileKey } = req.body;
  if (!fileKey) {
    return sendErrorResponse(res, 400, 'File key is required.');
  }

  // Authorization: Check if the user owns the file before deleting
  // This logic would involve checking a database record that links the fileKey to the userId.
  // For example: const fileRecord = await File.findOne({ key: fileKey, ownerId: req.user.id });
  // if (!fileRecord) { return sendErrorResponse(res, 403, 'You are not authorized to delete this file.'); }

  await fileService.deleteFile(fileKey);

  sendDeletedResponse(res, 'File deleted successfully.');
});


/**
 * Get storage statistics
 */
const getStorageStats = catchAsync(async (req, res) => {
    const stats = await fileService.getStorageStats();
    sendSuccessResponse(res, 200, 'Storage statistics retrieved successfully', stats);
});


module.exports = {
  uploadPublicFile,
  uploadPrivateFile,
  getFile,
  deleteFile,
  getStorageStats
};


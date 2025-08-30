/**
 * File Controller
 * Handles file uploads, downloads, and deletions.
 * Relies on a fileService for storage abstraction (e.g., local, S3).
 */

const {
    catchAsync
} = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendErrorResponse,
    sendNotFoundResponse
} = require('../utils/response');
const fileService = require('../services/fileService'); // Assuming this service exists
const {
    Assignment,
    Submission,
    User
} = require('../models');
const {
    USER_ROLES
} = require('../utils/constants');

/**
 * Upload a single file
 */
const uploadSingleFile = catchAsync(async (req, res) => {
    if (!req.file) {
        return sendErrorResponse(res, 400, 'No file uploaded.');
    }

    // The fileService is expected to handle moving the file from a temporary location
    // to a permanent one and return its metadata.
    const fileData = await fileService.handleFileUpload(req.file, req.body.folder || 'general');

    sendSuccessResponse(res, 201, 'File uploaded successfully', fileData);
});

/**
 * Upload multiple files
 */
const uploadMultipleFiles = catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return sendErrorResponse(res, 400, 'No files uploaded.');
    }

    const fileData = await fileService.handleMultipleFileUploads(req.files, req.body.folder || 'general');

    sendSuccessResponse(res, 201, 'Files uploaded successfully', fileData);
});

/**
 * Get/Download a file
 * Note: This is a simplified version. A real implementation would involve more robust
 * security checks to ensure the user has permission to access the file path.
 */
const getFile = catchAsync(async (req, res) => {
    const {
        filePath
    } = req.params; // The full path after /uploads/

    // Security check: Ensure the path is within the intended directory
    const isPathSafe = await fileService.isPathSecure(filePath);
    if (!isPathSafe) {
        return sendErrorResponse(res, 400, 'Invalid file path.');
    }

    const fileStream = await fileService.getFileStream(filePath);
    if (!fileStream) {
        return sendNotFoundResponse(res, 'File');
    }

    // Set headers to trigger download
    res.setHeader('Content-Type', fileStream.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileStream.originalName}"`);

    fileStream.stream.pipe(res);
});

/**
 * Delete a file
 * This requires context to check for permissions.
 */
const deleteFile = catchAsync(async (req, res) => {
    const {
        fileUrl,
        context,
        contextId
    } = req.body;
    const {
        id: userId,
        role
    } = req.user;

    if (!fileUrl || !context || !contextId) {
        return sendErrorResponse(res, 400, 'File URL, context, and context ID are required.');
    }

    let hasPermission = false;

    // Check permissions based on context
    switch (context) {
        case 'assignment_resource':
            const assignment = await Assignment.findById(contextId);
            if (assignment) {
                const teacher = await Teacher.findOne({
                    userId
                });
                if (role === USER_ROLES.ADMIN || (teacher && assignment.instructorId.equals(teacher._id))) {
                    hasPermission = true;
                }
            }
            break;

        case 'submission_file':
            const submission = await Submission.findById(contextId);
            if (submission) {
                const student = await Student.findOne({
                    userId
                });
                if (student && submission.studentId.equals(student._id)) {
                    hasPermission = true;
                }
            }
            break;

        case 'profile_image':
            if (contextId === userId) {
                hasPermission = true;
            }
            break;

        default:
            return sendErrorResponse(res, 400, 'Invalid context for file deletion.');
    }

    if (!hasPermission) {
        return sendErrorResponse(res, 403, 'You do not have permission to delete this file.');
    }

    // Delete file from storage
    await fileService.deleteFileByUrl(fileUrl);

    // TODO: Update the corresponding database record to remove the file reference.
    // This logic would be specific to each context. For example:
    // if (context === 'assignment_resource') {
    //   await Assignment.updateOne({ _id: contextId }, { $pull: { resources: { url: fileUrl } } });
    // }

    sendSuccessResponse(res, 200, 'File deleted successfully.');
});


module.exports = {
    uploadSingleFile,
    uploadMultipleFiles,
    getFile,
    deleteFile
};

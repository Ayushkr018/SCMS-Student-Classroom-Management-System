/**
 * Grade Controller
 * Handles all operations related to managing and analyzing student grades.
 */

const { Grade, Student, Course } = require('../models');
const { catchAsync } = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendPaginatedResponse,
    sendCreatedResponse,
    sendUpdatedResponse,
    sendDeletedResponse,
    sendNotFoundResponse,
    sendErrorResponse
} = require('../utils/response');
const { default: mongoose } = require('mongoose');
const notificationService = require('../services/notificationService');


/**
 * Get all grades (Admin view)
 */
const getAllGrades = catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [grades, total] = await Promise.all([
        Grade.find({})
            .populate('studentId', 'userId rollNumber')
            .populate('courseId', 'title courseCode')
            .sort({ gradedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Grade.countDocuments({})
    ]);

    sendPaginatedResponse(res, grades, parseInt(page), parseInt(limit), total);
});

/**
 * Get grade statistics for a specific course
 */
const getCourseGradeStatistics = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const stats = await Grade.getCourseStatistics(courseId, req.query.semester, req.query.academicYear);
    sendSuccessResponse(res, 200, 'Course grade statistics retrieved successfully', stats[0] || {});
});

/**
 * Get all grades for a student in a specific course
 */
const getStudentGradesForCourse = catchAsync(async (req, res) => {
    const { studentId, courseId } = req.params;
    const grades = await Grade.find({ studentId, courseId })
        .populate('assessmentId', 'title');
    sendSuccessResponse(res, 200, 'Student grades for course retrieved successfully', grades);
});

/**
 * Manually create a new grade
 */
const createGrade = catchAsync(async (req, res) => {
    const gradeData = req.body;
    gradeData.gradedBy = req.user.id; // Assuming the user ID is the teacher's User ID
    const grade = await Grade.create(gradeData);
    sendCreatedResponse(res, grade, 'Grade created successfully');
});

/**
 * Get a single grade by its ID
 */
const getGradeById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const grade = await Grade.findById(id).populate('studentId courseId assessmentId');
    if (!grade) {
        return sendNotFoundResponse(res, 'Grade');
    }
    sendSuccessResponse(res, 200, 'Grade retrieved successfully', grade);
});

/**
 * Update a grade
 */
const updateGrade = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { scoreObtained, comments } = req.body;
    
    const grade = await Grade.findById(id);
    if (!grade) {
        return sendNotFoundResponse(res, 'Grade');
    }
    
    const updatedGrade = await grade.updateGrade(scoreObtained, comments, req.user.id);

    // Send notification to the student
    // This requires fetching the submission associated with the grade if available
    // For manual grades, we might notify differently.
    // await notificationService.sendGradeNotification(submission);


    sendUpdatedResponse(res, updatedGrade, 'Grade updated successfully');
});

/**
 * Delete a grade
 */
const deleteGrade = catchAsync(async (req, res) => {
    const { id } = req.params;
    const grade = await Grade.findByIdAndDelete(id);
    if (!grade) {
        return sendNotFoundResponse(res, 'Grade');
    }
    sendDeletedResponse(res, 'Grade deleted successfully');
});


/**
 * Releases all grades for a specific assignment or test.
 */
const releaseGrades = catchAsync(async (req, res) => {
    const { assessmentId } = req.params;

    const result = await Grade.updateMany(
        { assessmentId: assessmentId, isReleased: false },
        { $set: { isReleased: true, releasedAt: new Date() } }
    );

    if (result.nModified === 0) {
        return sendSuccessResponse(res, 200, 'No new grades were available to be released.');
    }

    // Send notifications for released grades (can be a background job)
    // queueService.addJob('notification', { type: 'grades_released', assessmentId });
    
    sendSuccessResponse(res, 200, `${result.nModified} grades have been released successfully.`);
});


module.exports = {
    getAllGrades,
    getCourseGradeStatistics,
    getStudentGradesForCourse,
    createGrade,
    getGradeById,
    updateGrade,
    deleteGrade,
    releaseGrades, // Make sure to export the new function
};


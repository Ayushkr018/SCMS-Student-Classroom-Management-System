/**
 * Submission Controller
 * Handles operations related to viewing and managing individual submissions
 */

const {
    Submission,
    Assignment,
    Student,
    Teacher
} = require('../models');
const {
    catchAsync
} = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendPaginatedResponse,
    sendNotFoundResponse,
    sendErrorResponse
} = require('../utils/response');
const {
    USER_ROLES
} = require('../utils/constants');

/**
* Get all submissions for the currently logged-in student
*/
const getMySubmissions = catchAsync(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        courseId,
        status,
        sort = '-submittedAt'
    } = req.query;

    const student = await Student.findOne({
        userId: req.user.id
    });
    if (!student) {
        return sendErrorResponse(res, 404, 'Student profile not found.');
    }

    const filter = {
        studentId: student._id
    };
    if (courseId) {
        // Find an assignment in that course to filter submissions
        const assignments = await Assignment.find({
            courseId: courseId
        }).select('_id');
        const assignmentIds = assignments.map(a => a._id);
        filter.assignmentId = {
            $in: assignmentIds
        };
    }
    if (status) filter.status = status;


    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [submissions, total] = await Promise.all([
        Submission.find(filter)
        .populate({
            path: 'assignmentId',
            select: 'title assignmentCode dueDate courseId',
            populate: {
                path: 'courseId',
                select: 'title courseCode'
            }
        })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
        Submission.countDocuments(filter)
    ]);

    sendPaginatedResponse(res, submissions, parseInt(page), parseInt(limit), total, 'Your submissions retrieved successfully.');
});

/**
 * Get a single submission by its ID
 */
const getSubmissionById = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;

    const submission = await Submission.findById(id)
        .populate({
            path: 'assignmentId',
            populate: {
                path: 'courseId instructorId'
            }
        })
        .populate({
            path: 'studentId',
            populate: {
                path: 'userId',
                select: 'firstName lastName email'
            }
        });

    if (!submission) {
        return sendNotFoundResponse(res, 'Submission');
    }

    // Authorization check
    const isOwner = req.user.id.toString() === submission.studentId.userId._id.toString();
    const isAdmin = req.user.role === USER_ROLES.ADMIN;
    let isInstructor = false;

    if (req.user.role === USER_ROLES.TEACHER) {
        const teacher = await Teacher.findOne({
            userId: req.user.id
        });
        if (teacher && submission.assignmentId.instructorId.equals(teacher._id)) {
            isInstructor = true;
        }
    }

    if (!isOwner && !isAdmin && !isInstructor) {
        return sendErrorResponse(res, 403, 'You are not authorized to view this submission.');
    }

    sendSuccessResponse(res, 200, 'Submission retrieved successfully', submission);
});

module.exports = {
    getMySubmissions,
    getSubmissionById
};

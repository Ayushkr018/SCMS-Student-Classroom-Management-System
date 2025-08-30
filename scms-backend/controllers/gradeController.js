/**
 * Grade Controller
 * Handles all grading-related operations and analytics
 */

const {
    Grade,
    Student,
    Teacher,
    Course
} = require('../models');
const {
    catchAsync
} = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendErrorResponse,
    sendPaginatedResponse,
    sendUpdatedResponse,
    sendNotFoundResponse
} = require('../utils/response');
const {
    USER_ROLES
} = require('../utils/constants');
const mongoose = require('mongoose');

/**
 * Get grades for a specific student (Student view)
 */
const getMyGrades = catchAsync(async (req, res) => {
    const student = await Student.findOne({
        userId: req.user.id
    });
    if (!student) {
        return sendErrorResponse(res, 404, 'Student profile not found');
    }

    const {
        courseId,
        semester,
        academicYear
    } = req.query;
    const filter = {
        studentId: student._id
    };
    if (courseId) filter.courseId = courseId;
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;

    const grades = await Grade.find(filter)
        .populate('courseId', 'title courseCode')
        .populate('gradedBy', 'firstName lastName')
        .sort('-gradedAt');

    sendSuccessResponse(res, 200, 'Your grades retrieved successfully', grades);
});

/**
 * Get grade book for a course (Teacher view)
 */
const getCourseGradebook = catchAsync(async (req, res) => {
    const {
        courseId
    } = req.params;
    const {
        assessmentType,
        studentId
    } = req.query;

    const course = await Course.findById(courseId);
    if (!course) {
        return sendNotFoundResponse(res, 'Course');
    }

    // Permission check
    if (req.user.role !== USER_ROLES.ADMIN) {
        const teacher = await Teacher.findOne({
            userId: req.user.id
        });
        const isInstructor = course.instructors.some(inst => inst.teacherId.equals(teacher._id));
        if (!isInstructor) {
            return sendErrorResponse(res, 403, 'You are not an instructor for this course.');
        }
    }

    const filter = {
        courseId
    };
    if (assessmentType) filter.assessmentType = assessmentType;
    if (studentId) filter.studentId = studentId;

    const grades = await Grade.find(filter)
        .populate('studentId', 'rollNumber userId')
        .populate({
            path: 'studentId',
            populate: {
                path: 'userId',
                select: 'firstName lastName'
            }
        })
        .sort('studentId gradedAt');

    sendSuccessResponse(res, 200, 'Course grade book retrieved successfully', grades);
});

/**
 * Update a specific grade
 */
const updateGrade = catchAsync(async (req, res) => {
    const {
        gradeId
    } = req.params;
    const {
        scoreObtained,
        comments,
        feedback
    } = req.body;

    const grade = await Grade.findById(gradeId).populate('courseId');
    if (!grade) {
        return sendNotFoundResponse(res, 'Grade');
    }

    // Permission check
    if (req.user.role !== USER_ROLES.ADMIN) {
        const teacher = await Teacher.findOne({
            userId: req.user.id
        });
        if (!grade.gradedBy.equals(teacher._id)) {
            return sendErrorResponse(res, 403, 'You can only update grades you have assigned.');
        }
    }

    // Update grade
    await grade.updateGrade(scoreObtained, 'Manual update by instructor', req.user.id);
    grade.comments = comments || grade.comments;
    grade.feedback = feedback || grade.feedback;

    const updatedGrade = await grade.save();

    sendUpdatedResponse(res, updatedGrade);
});


/**
 * Release grades for an assessment
 */
const releaseGrades = catchAsync(async (req, res) => {
    const {
        courseId,
        assessmentId
    } = req.body;

    if (!courseId || !assessmentId) {
        return sendErrorResponse(res, 400, 'Course ID and Assessment ID are required.');
    }

    const result = await Grade.updateMany({
        courseId,
        assessmentId,
        isReleased: false
    }, {
        $set: {
            isReleased: true,
            releasedAt: new Date()
        }
    });

    if (result.nModified === 0) {
        return sendSuccessResponse(res, 200, 'No new grades to release or grades already released.');
    }

    // TODO: Send notification to students that grades have been released

    sendSuccessResponse(res, 200, `${result.nModified} grades have been released.`);
});

/**
 * Get course performance analytics
 */
const getCourseAnalytics = catchAsync(async (req, res) => {
    const {
        courseId
    } = req.params;

    const stats = await Grade.getCourseStatistics(courseId, 'current', '2024-2025'); // Use dynamic values

    if (!stats || stats.length === 0) {
        return sendSuccessResponse(res, 200, 'No grading data available for this course yet.', {});
    }

    sendSuccessResponse(res, 200, 'Course analytics retrieved successfully', stats[0]);
});

/**
 * Get student performance analytics
 */
const getStudentAnalytics = catchAsync(async (req, res) => {
    const {
        studentId
    } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
        return sendNotFoundResponse(res, 'Student');
    }

    const cgpa = await Grade.calculateCGPA(studentId);

    // Get semester-wise performance
    const semesterPerformance = await Grade.aggregate([{
        $match: {
            studentId: mongoose.Types.ObjectId(studentId)
        }
    }, {
        $group: {
            _id: '$semester',
            totalCredits: {
                $sum: '$credits'
            },
            totalGradePoints: {
                $sum: {
                    $multiply: ['$gradePoints', '$credits']
                }
            }
        }
    }, {
        $project: {
            semester: '$_id',
            sgpa: {
                $cond: [{
                    $eq: ['$totalCredits', 0]
                }, 0, {
                    $divide: ['$totalGradePoints', '$totalCredits']
                }]
            }
        }
    }, {
        $sort: {
            semester: 1
        }
    }]);

    sendSuccessResponse(res, 200, 'Student performance analytics retrieved', {
        cgpa,
        semesterPerformance
    });
});


module.exports = {
    getMyGrades,
    getCourseGradebook,
    updateGrade,
    releaseGrades,
    getCourseAnalytics,
    getStudentAnalytics
};

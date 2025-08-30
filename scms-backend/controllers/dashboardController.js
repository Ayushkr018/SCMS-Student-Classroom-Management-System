/**
 * Dashboard Controller
 * Provides aggregated data for user dashboards
 */

const {
    User,
    Student,
    Teacher,
    Course,
    Assignment,
    Submission,
    Grade
} = require('../models');
const {
    catchAsync
} = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendErrorResponse
} = require('../utils/response');
const {
    USER_ROLES
} = require('../utils/constants');
const mongoose = require('mongoose');

/**
 * Main dashboard stats router based on user role
 */
const getDashboardStats = catchAsync(async (req, res) => {
    const {
        role
    } = req.user;

    switch (role) {
        case USER_ROLES.ADMIN:
            return getAdminDashboardStats(req, res);
        case USER_ROLES.TEACHER:
            return getTeacherDashboardStats(req, res);
        case USER_ROLES.STUDENT:
            return getStudentDashboardStats(req, res);
        default:
            return sendErrorResponse(res, 403, 'No dashboard available for this role');
    }
});

/**
 * Get dashboard stats for Admin
 */
const getAdminDashboardStats = async (req, res) => {
    const [userCounts, courseCount, assignmentCount, activeStudentsCount, popularCourses, recentUsers] = await Promise.all([
        User.aggregate([{
            $group: {
                _id: '$role',
                count: {
                    $sum: 1
                }
            }
        }]),
        Course.countDocuments(),
        Assignment.countDocuments(),
        Student.countDocuments({
            academicStatus: 'active'
        }),
        Course.find({
            status: 'active'
        }).sort({
            'enrollment.currentEnrollment': -1
        }).limit(5).select('title courseCode enrollment.currentEnrollment'),
        User.find().sort({
            createdAt: -1
        }).limit(5).select('firstName lastName email role createdAt')
    ]);

    const stats = {
        users: {
            total: userCounts.reduce((sum, item) => sum + item.count, 0),
            roles: userCounts.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        },
        courses: {
            total: courseCount,
            popular: popularCourses
        },
        assignments: {
            total: assignmentCount
        },
        students: {
            active: activeStudentsCount
        }
    };

    sendSuccessResponse(res, 200, 'Admin dashboard stats retrieved', {
        stats,
        recentActivity: {
            newUsers: recentUsers
        }
    });
};

/**
 * Get dashboard stats for Teacher
 */
const getTeacherDashboardStats = async (req, res) => {
    const teacher = await Teacher.findOne({
        userId: req.user.id
    });
    if (!teacher) {
        return sendErrorResponse(res, 404, 'Teacher profile not found');
    }

    const assignedCourseIds = teacher.assignedCourses.map(c => c.courseId);

    const [courses, upcomingAssignments, needsGradingCount] = await Promise.all([
        Course.find({
            _id: {
                $in: assignedCourseIds
            }
        }).select('title courseCode enrollment.currentEnrollment'),
        Assignment.find({
            courseId: {
                $in: assignedCourseIds
            },
            dueDate: {
                $gte: new Date()
            },
            status: 'published'
        }).sort({
            dueDate: 1
        }).limit(5).select('title dueDate courseId'),
        Submission.countDocuments({
            assignmentId: {
                $in: (await Assignment.find({
                    instructorId: teacher._id
                }).select('_id')).map(a => a._id)
            },
            'grading.status': 'not_graded',
            status: 'submitted'
        })
    ]);

    const totalStudents = courses.reduce((sum, course) => sum + course.enrollment.currentEnrollment, 0);

    const stats = {
        totalCourses: courses.length,
        totalStudents,
        needsGrading: needsGradingCount
    };

    sendSuccessResponse(res, 200, 'Teacher dashboard stats retrieved', {
        stats,
        courses,
        upcomingDeadlines: upcomingAssignments
    });
};

/**
 * Get dashboard stats for Student
 */
const getStudentDashboardStats = async (req, res) => {
    const student = await Student.findOne({
        userId: req.user.id
    });
    if (!student) {
        return sendErrorResponse(res, 404, 'Student profile not found');
    }

    const enrolledCourseIds = student.enrolledCourses
        .filter(c => c.status === 'active')
        .map(c => c.courseId);

    const [upcomingAssignments, recentGrades, courseCount] = await Promise.all([
        Assignment.find({
            courseId: {
                $in: enrolledCourseIds
            },
            dueDate: {
                $gte: new Date()
            },
            status: 'published'
        }).sort({
            dueDate: 1
        }).limit(5).populate('courseId', 'title courseCode'),
        Grade.find({
            studentId: student._id
        }).sort({
            gradedAt: -1
        }).limit(5).populate('courseId', 'title courseCode'),
        student.enrolledCourses.filter(c => c.status === 'active').length
    ]);

    const stats = {
        cgpa: student.cgpa,
        activeCourses: courseCount,
        completedCredits: student.completedCredits
    };

    sendSuccessResponse(res, 200, 'Student dashboard stats retrieved', {
        stats,
        upcomingDeadlines: upcomingAssignments,
        recentGrades
    });
};

module.exports = {
    getDashboardStats
};

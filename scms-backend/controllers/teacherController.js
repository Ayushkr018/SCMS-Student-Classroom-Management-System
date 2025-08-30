/**
 * Teacher Controller
 * Handles all operations related to teacher management
 */

const {
    Teacher,
    User,
    Course,
    Assignment
} = require('../models');
const {
    catchAsync
} = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendPaginatedResponse,
    sendUpdatedResponse,
    sendNotFoundResponse,
    sendErrorResponse
} = require('../utils/response');
const {
    USER_ROLES
} = require('../utils/constants');

/**
 * Get all teachers (Admin view)
 */
const getAllTeachers = catchAsync(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        department,
        designation,
        status,
        search,
        sort = 'employeeId'
    } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (status) filter.currentStatus = status;

    // Build search query for associated User
    let userFilter = {};
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        userFilter = {
            $or: [{
                firstName: searchRegex
            }, {
                lastName: searchRegex
            }, {
                email: searchRegex
            }],
            role: USER_ROLES.TEACHER // Ensure we only search within teachers
        };
    } else {
        userFilter = {
            role: USER_ROLES.TEACHER
        };
    }


    const users = await User.find(userFilter).select('_id');
    const userIds = users.map(user => user._id);

    // Apply user search to the main filter
    filter.userId = {
        $in: userIds
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [teachers, total] = await Promise.all([
        Teacher.find(filter)
        .populate('userId', 'firstName lastName email profileImage status')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
        Teacher.countDocuments(filter)
    ]);

    sendPaginatedResponse(res, teachers, parseInt(page), parseInt(limit), total);
});

/**
 * Get a single teacher by ID
 */
const getTeacherById = catchAsync(async (req, res) => {
    const {
        id
    } = req.params; // This is the Teacher ID

    const teacher = await Teacher.findById(id)
        .populate('userId')
        .populate('assignedCourses.courseId', 'title courseCode');

    if (!teacher) {
        return sendNotFoundResponse(res, 'Teacher');
    }

    // Authorization: Admins or the teacher themselves can view their full profile
    const isOwner = req.user.id.toString() === teacher.userId._id.toString();
    const isAdmin = req.user.role === USER_ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
        // Students/other users might see a limited public profile in a different endpoint
        return sendErrorResponse(res, 403, 'You are not authorized to view this profile.');
    }

    sendSuccessResponse(res, 200, 'Teacher profile retrieved successfully', teacher);
});

/**
 * Update a teacher's profile (Admin only)
 */
const updateTeacher = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const teacherUpdates = req.body;
    const userUpdates = teacherUpdates.userId || {};

    // Prevent restricted fields from being updated this way
    delete teacherUpdates.userId;
    delete userUpdates.password;
    delete userUpdates.role;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
        return sendNotFoundResponse(res, 'Teacher');
    }

    // Update the Teacher document
    Object.assign(teacher, teacherUpdates);
    await teacher.save();

    // Update the associated User document if necessary
    if (Object.keys(userUpdates).length > 0) {
        await User.findByIdAndUpdate(teacher.userId, userUpdates, {
            runValidators: true
        });
    }

    const updatedTeacher = await Teacher.findById(id).populate('userId');

    sendUpdatedResponse(res, updatedTeacher, 'Teacher profile updated successfully');
});


/**
 * Delete a teacher (Soft delete by changing status)
 */
const deleteTeacher = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
        return sendNotFoundResponse(res, 'Teacher');
    }

    // Change status to 'resigned' or 'inactive'
    teacher.currentStatus = 'resigned';
    await teacher.save();

    // Change user status to 'inactive'
    await User.findByIdAndUpdate(teacher.userId, {
        status: 'inactive'
    });

    sendSuccessResponse(res, 200, 'Teacher has been marked as inactive.');
});


/**
 * Get a teacher's assigned courses
 */
const getTeacherCourses = catchAsync(async (req, res) => {
    const {
        teacherId
    } = req.params; // Can be used by admin to check a specific teacher

    const targetUserId = req.user.role === USER_ROLES.ADMIN ? (await Teacher.findById(teacherId))?.userId : req.user.id;

    if (!targetUserId) {
        return sendNotFoundResponse(res, "Teacher");
    }

    const teacher = await Teacher.findOne({
            userId: targetUserId
        })
        .populate({
            path: 'assignedCourses.courseId',
            select: 'title courseCode department statistics',
        });

    if (!teacher) {
        return sendNotFoundResponse(res, 'Teacher profile');
    }

    sendSuccessResponse(res, 200, 'Teacher courses retrieved successfully', teacher.assignedCourses);
});

/**
 * Get a teacher's created assignments
 */
const getTeacherAssignments = catchAsync(async (req, res) => {
    const {
        teacherId
    } = req.params;

    const targetUserId = req.user.role === USER_ROLES.ADMIN ? (await Teacher.findById(teacherId))?.userId : req.user.id;

    if (!targetUserId) {
        return sendNotFoundResponse(res, "Teacher");
    }

    const teacher = await Teacher.findOne({
        userId: targetUserId
    });

    if (!teacher) {
        return sendNotFoundResponse(res, 'Teacher profile');
    }

    const assignments = await Assignment.find({
            instructorId: teacher._id
        })
        .populate('courseId', 'title courseCode')
        .sort('-createdAt');

    sendSuccessResponse(res, 200, 'Teacher assignments retrieved successfully', assignments);
});


module.exports = {
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getTeacherCourses,
    getTeacherAssignments
};

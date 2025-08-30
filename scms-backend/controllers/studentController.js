/**
 * Student Controller
 * Handles all operations related to student management
 */

const {
    Student,
    User,
    Course,
    Grade
} = require('../models');
const {
    catchAsync
} = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendPaginatedResponse,
    sendCreatedResponse,
    sendUpdatedResponse,
    sendDeletedResponse,
    sendNotFoundResponse,
    sendErrorResponse
} = require('../utils/response');
const {
    USER_ROLES
} = require('../utils/constants');

/**
 * Get all students (Admin/Teacher view)
 */
const getAllStudents = catchAsync(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        branch,
        semester,
        batch,
        status,
        search,
        sort = 'rollNumber'
    } = req.query;

    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.currentSemester = semester;
    if (batch) filter.batch = batch;
    if (status) filter.academicStatus = status;

    // Build search query
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
            }, ],
        };
    }

    const users = await User.find(userFilter).select('_id');
    const userIds = users.map(user => user._id);

    if (search) {
        filter.$or = [{
            rollNumber: {
                $regex: search,
                $options: 'i'
            }
        }, {
            userId: {
                $in: userIds
            }
        }, ];
    }


    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [students, total] = await Promise.all([
        Student.find(filter)
        .populate('userId', 'firstName lastName email profileImage status')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
        Student.countDocuments(filter)
    ]);

    sendPaginatedResponse(res, students, parseInt(page), parseInt(limit), total);
});

/**
 * Get a single student by ID
 */
const getStudentById = catchAsync(async (req, res) => {
    const {
        id
    } = req.params; // This is the Student ID, not the User ID

    const student = await Student.findById(id)
        .populate('userId')
        .populate('enrolledCourses.courseId', 'title courseCode');

    if (!student) {
        return sendNotFoundResponse(res, 'Student');
    }

    // Access control: Admins, the student themselves, or their teachers can view
    const isOwner = req.user.id.toString() === student.userId._id.toString();
    const isAdmin = req.user.role === USER_ROLES.ADMIN;
    // A more complex check would be needed for teachers based on course enrollment

    if (!isOwner && !isAdmin) {
        // Basic teacher check placeholder
        if (req.user.role !== USER_ROLES.TEACHER) {
            return sendErrorResponse(res, 403, 'You are not authorized to view this profile.');
        }
    }

    sendSuccessResponse(res, 200, 'Student profile retrieved successfully', student);
});


/**
 * Update a student's profile (Admin only)
 */
const updateStudent = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const studentUpdates = req.body;
    const userUpdates = studentUpdates.userId || {};

    // Prevent restricted fields from being updated this way
    delete studentUpdates.userId;
    delete userUpdates.password;
    delete userUpdates.role;

    const student = await Student.findById(id);
    if (!student) {
        return sendNotFoundResponse(res, 'Student');
    }

    // Update the Student document
    Object.assign(student, studentUpdates);
    await student.save();

    // Update the associated User document if necessary
    if (Object.keys(userUpdates).length > 0) {
        await User.findByIdAndUpdate(student.userId, userUpdates, {
            runValidators: true
        });
    }

    const updatedStudent = await Student.findById(id).populate('userId');

    sendUpdatedResponse(res, updatedStudent, 'Student profile updated successfully');
});

/**
 * Delete a student (Soft delete by changing status)
 */
const deleteStudent = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;

    const student = await Student.findById(id);
    if (!student) {
        return sendNotFoundResponse(res, 'Student');
    }

    // Change academic status to 'dropped_out' or similar
    student.academicStatus = 'dropped_out';
    await student.save();

    // Change user status to 'inactive'
    await User.findByIdAndUpdate(student.userId, {
        status: 'inactive'
    });

    sendSuccessResponse(res, 200, 'Student has been marked as inactive.');
});

/**
 * Get a student's grades
 */
const getStudentGrades = catchAsync(async (req, res) => {
    const {
        studentId
    } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
        return sendNotFoundResponse(res, 'Student');
    }

    // Authorization check
    const isOwner = req.user.id.toString() === student.userId.toString();
    if (req.user.role !== USER_ROLES.ADMIN && !isOwner) {
        return sendErrorResponse(res, 403, 'You are not authorized to view these grades.');
    }

    const grades = await Grade.find({
            studentId: studentId
        })
        .populate('courseId', 'title courseCode')
        .populate('assessmentId', 'title')
        .sort('-gradedAt');

    const cgpa = await Grade.calculateCGPA(studentId);

    sendSuccessResponse(res, 200, 'Student grades retrieved successfully', {
        grades,
        cgpa
    });
});

/**
 * Get a student's course enrollments
 */
const getStudentEnrollments = catchAsync(async (req, res) => {
    const {
        studentId
    } = req.params;

    const student = await Student.findById(studentId)
        .populate({
            path: 'enrolledCourses.courseId',
            select: 'title courseCode department credits',
            populate: {
                path: 'instructors.teacherId',
                select: 'firstName lastName',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            }
        });


    if (!student) {
        return sendNotFoundResponse(res, 'Student');
    }

    // Authorization check
    const isOwner = req.user.id.toString() === student.userId.toString();
    if (req.user.role !== USER_ROLES.ADMIN && !isOwner) {
        return sendErrorResponse(res, 403, 'You are not authorized to view enrollments.');
    }

    sendSuccessResponse(res, 200, 'Student enrollments retrieved successfully', student.enrolledCourses);
});

module.exports = {
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentGrades,
    getStudentEnrollments
};

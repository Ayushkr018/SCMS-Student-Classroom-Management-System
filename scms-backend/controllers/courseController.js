/**
 * Course Controller
 * Handles all course-related operations
 */

const { Course, Student, Teacher, User } = require('../models');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { 
  sendSuccessResponse, 
  sendErrorResponse,
  sendPaginatedResponse,
  sendCreatedResponse,
  sendUpdatedResponse,
  sendDeletedResponse,
  sendNotFoundResponse
} = require('../utils/response');
const { USER_ROLES } = require('../utils/constants');

/**
 * Get all courses with filtering and pagination
 */
const getAllCourses = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    department,
    level,
    semester,
    academicYear,
    status,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build filter object
  const filter = {};
  if (department) filter.department = department;
  if (level) filter.level = level;
  if (semester) filter['schedule.semester'] = semester;
  if (academicYear) filter['schedule.academicYear'] = academicYear;
  if (status) filter.status = status;

  // If user is not authenticated or not admin, only show published/active courses
  if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
    filter.status = { $in: ['published', 'active'] };
    filter.visibility = { $in: ['public', 'restricted'] };
  }

  // Search functionality
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { courseCode: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate({
        path: 'instructors.teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName email designation'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Course.countDocuments(filter)
  ]);

  sendPaginatedResponse(res, courses, parseInt(page), parseInt(limit), total);
});

/**
 * Get available courses for registration
 */
const getAvailableCourses = catchAsync(async (req, res) => {
  const now = new Date();
  
  const courses = await Course.find({
    status: 'active',
    'enrollment.registrationStart': { $lte: now },
    'enrollment.registrationEnd': { $gte: now },
    $expr: { $lt: ['$enrollment.currentEnrollment', '$enrollment.maxStudents'] }
  })
  .populate({
        path: 'instructors.teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName designation'
        }
    })
  .lean();

  sendSuccessResponse(res, 200, 'Available courses retrieved successfully', courses);
});

/**
 * Get user's courses
 */
const getMyCourses = catchAsync(async (req, res) => {
  let courses = [];

  if (req.user.role === USER_ROLES.STUDENT) {
    // Get student's enrolled courses
    const student = await Student.findOne({ userId: req.user.id })
      .populate({
        path: 'enrolledCourses.courseId',
        populate: {
          path: 'instructors.teacherId',
          populate: {
              path: 'userId',
              select: 'firstName lastName designation'
            }
        }
      });

    if (student) {
      courses = student.enrolledCourses.map(enrollment => ({
        course: enrollment.courseId,
        enrollmentStatus: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
        grade: enrollment.grade
      }));
    }
  } else if (req.user.role === USER_ROLES.TEACHER) {
    // Get teacher's assigned courses
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    if (teacher && teacher.assignedCourses.length > 0) {
      const courseIds = teacher.assignedCourses.map(assignment => assignment.courseId);
      const assignedCourses = await Course.find({ _id: { $in: courseIds } });
      
      courses = assignedCourses.map(course => {
        const assignment = teacher.assignedCourses.find(
          a => a.courseId.toString() === course._id.toString()
        );
        return {
          course,
          role: assignment.role,
          assignedDate: assignment.assignedDate
        };
      });
    }
  }

  sendSuccessResponse(res, 200, 'My courses retrieved successfully', courses);
});

/**
 * Create new course
 */
const createCourse = catchAsync(async (req, res) => {
  const courseData = req.body;

  // Check if course code already exists
  const existingCourse = await Course.findOne({ courseCode: courseData.courseCode.toUpperCase() });
  if (existingCourse) {
    return sendErrorResponse(res, 409, 'Course with this code already exists');
  }

  // If user is a teacher (not admin), set them as primary instructor
  if (req.user.role === USER_ROLES.TEACHER) {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (teacher) {
      courseData.instructors = [{
        teacherId: teacher._id,
        role: 'primary',
        responsibilityPercentage: 100
      }];
    }
  }

  const course = await Course.create(courseData);

  // If teacher created the course, update their assigned courses
  if (req.user.role === USER_ROLES.TEACHER) {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    await Teacher.findByIdAndUpdate(
      teacher._id,
      {
        $push: {
          assignedCourses: {
            courseId: course._id,
            role: 'instructor',
            semester: course.schedule.semester,
            year: parseInt(course.schedule.academicYear.split('-')[0]),
            assignedDate: new Date()
          }
        }
      }
    );
  }

  sendCreatedResponse(res, course, 'Course created successfully');
});

/**
 * Get course by ID
 */
const getCourseById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id)
    .populate({
        path: 'instructors.teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName email designation department'
        }
    })
    .populate('prerequisites.courseId', 'title courseCode')
    .populate('corequisites.courseId', 'title courseCode');

  if (!course) {
    return sendNotFoundResponse(res, 'Course');
  }

  // Check visibility permissions
  if (!req.user && course.visibility === 'private') {
    return sendErrorResponse(res, 403, 'This course is private');
  }

  if (!req.user && !['published', 'active'].includes(course.status)) {
    return sendNotFoundResponse(res, 'Course');
  }

  sendSuccessResponse(res, 200, 'Course retrieved successfully', course);
});

/**
 * Update course
 */
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const course = await Course.findById(id);
  if (!course) {
    return sendNotFoundResponse(res, 'Course');
  }

  // Check if user has permission to update this course
  if (req.user.role !== USER_ROLES.ADMIN) {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    const isInstructor = course.instructors.some(
      instructor => instructor.teacherId.toString() === teacher._id.toString()
    );
    
    if (!isInstructor) {
      return sendErrorResponse(res, 403, 'You are not authorized to update this course');
    }
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    { ...updates },
    { new: true, runValidators: true }
  ).populate({
        path: 'instructors.teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName designation'
        }
    });

  sendUpdatedResponse(res, updatedCourse);
});

/**
 * Delete course
 */
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    return sendNotFoundResponse(res, 'Course');
  }

  // Check if course has enrolled students
  if (course.enrollment.currentEnrollment > 0) {
    return sendErrorResponse(res, 400, 'Cannot delete course with enrolled students');
  }

  // Remove course from teacher's assigned courses
  await Teacher.updateMany(
    { 'assignedCourses.courseId': id },
    { $pull: { assignedCourses: { courseId: id } } }
  );

  // Delete the course
  await Course.findByIdAndDelete(id);

  sendDeletedResponse(res, 'Course deleted successfully');
});

/**
 * Enroll student in course
 */
const enrollInCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    return sendNotFoundResponse(res, 'Course');
  }

  // Check if enrollment is possible
  const enrollmentCheck = course.canEnroll(req.user.id);
  if (!enrollmentCheck.canEnroll) {
    return sendErrorResponse(res, 400, enrollmentCheck.reason);
  }

  const student = await Student.findOne({ userId: req.user.id });
  if (!student) {
    return sendErrorResponse(res, 404, 'Student profile not found');
  }

  // Check if already enrolled
  const existingEnrollment = student.enrolledCourses.find(
    enrollment => enrollment.courseId.toString() === id
  );

  if (existingEnrollment) {
    return sendErrorResponse(res, 400, 'Already enrolled in this course');
  }

  // Enroll student
  student.enrolledCourses.push({
    courseId: id,
    enrollmentDate: new Date(),
    status: 'active'
  });

  await student.save();
  await course.addStudent();

  sendSuccessResponse(res, 200, 'Successfully enrolled in course');
});

/**
 * Drop student from course
 */
const dropFromCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    return sendNotFoundResponse(res, 'Course');
  }

  const student = await Student.findOne({ userId: req.user.id });
  if (!student) {
    return sendErrorResponse(res, 404, 'Student profile not found');
  }

  // Find enrollment
  const enrollmentIndex = student.enrolledCourses.findIndex(
    enrollment => enrollment.courseId.toString() === id
  );

  if (enrollmentIndex === -1) {
    return sendErrorResponse(res, 400, 'Not enrolled in this course');
  }

  // Check if drop deadline has passed
  const now = new Date();
  if (now > course.enrollment.dropDeadline) {
    return sendErrorResponse(res, 400, 'Drop deadline has passed');
  }

  // Drop student
  student.enrolledCourses.splice(enrollmentIndex, 1);
  await student.save();
  await course.removeStudent();

  sendSuccessResponse(res, 200, 'Successfully dropped from course');
});

/**
 * Get enrolled students for a course
 */
const getEnrolledStudents = catchAsync(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    return sendNotFoundResponse(res, 'Course');
  }

  // Check if user has permission to view enrolled students
  if (req.user.role !== USER_ROLES.ADMIN) {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    const isInstructor = course.instructors.some(
      instructor => instructor.teacherId.toString() === teacher._id.toString()
    );
    
    if (!isInstructor) {
      return sendErrorResponse(res, 403, 'You are not authorized to view students for this course');
    }
  }

  // Get enrolled students
  const students = await Student.find({
    'enrolledCourses.courseId': id,
    'enrolledCourses.status': 'active'
  })
  .populate('userId', 'firstName lastName email profileImage')
  .select('rollNumber currentSemester cgpa enrolledCourses')
  .lean();

  const enrolledStudents = students.map(student => {
    const enrollment = student.enrolledCourses.find(
      e => e.courseId.toString() === id
    );
    
    return {
      studentId: student._id,
      user: student.userId,
      rollNumber: student.rollNumber,
      currentSemester: student.currentSemester,
      cgpa: student.cgpa,
      enrollmentDate: enrollment.enrollmentDate,
      status: enrollment.status,
      grade: enrollment.grade
    };
  });

  sendSuccessResponse(res, 200, 'Enrolled students retrieved successfully', {
    course: {
      id: course._id,
      title: course.title,
      courseCode: course.courseCode
    },
    students: enrolledStudents,
    totalEnrolled: enrolledStudents.length,
    maxStudents: course.enrollment.maxStudents,
    availableSeats: course.availableSeats
  });
});

module.exports = {
  getAllCourses,
  getAvailableCourses,
  getMyCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  dropFromCourse,
  getEnrolledStudents
};

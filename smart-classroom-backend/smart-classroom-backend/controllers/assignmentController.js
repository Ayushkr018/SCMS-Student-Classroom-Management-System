/**
 * Assignment Controller
 * Handles assignment lifecycle and submissions
 */

const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Student = require('../models/Student');
const Course = require('../models/Course');
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
const fileService = require('../services/fileService');
const notificationService = require('../services/notificationService');

/**
 * Get all assignments with filtering
 */
const getAllAssignments = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    courseId,
    type,
    status,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build filter object
  const filter = {};
  if (courseId) filter.courseId = courseId;
  if (type) filter.type = type;
  if (status) filter.status = status;

  // Role-based filtering
  if (req.user.role === USER_ROLES.STUDENT) {
    // Students see only published assignments from their enrolled courses
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      const enrolledCourseIds = student.enrolledCourses
        .filter(enrollment => enrollment.status === 'active')
        .map(enrollment => enrollment.courseId);
      filter.courseId = { $in: enrolledCourseIds };
      filter.status = 'published';
    }
  } else if (req.user.role === USER_ROLES.TEACHER) {
    // Teachers see assignments from their courses
    if (!courseId) {
      const Teacher = require('../models/Teacher');
      const teacher = await Teacher.findOne({ userId: req.user.id });
      if (teacher) {
        const assignedCourseIds = teacher.assignedCourses.map(assignment => assignment.courseId);
        filter.courseId = { $in: assignedCourseIds };
      }
    }
  }

  // Search functionality
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { assignmentCode: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [assignments, total] = await Promise.all([
    Assignment.find(filter)
      .populate('courseId', 'title courseCode')
      .populate('instructorId', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Assignment.countDocuments(filter)
  ]);

  // Add submission status for students
  if (req.user.role === USER_ROLES.STUDENT) {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      for (let assignment of assignments) {
        const submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId: student._id
        });
        assignment.submissionStatus = submission ? submission.status : 'not_started';
        assignment.submissionId = submission ? submission._id : null;
      }
    }
  }

  sendPaginatedResponse(res, assignments, parseInt(page), parseInt(limit), total);
});

/**
 * Create new assignment
 */
const createAssignment = catchAsync(async (req, res) => {
  const assignmentData = req.body;

  // Verify course access for teachers
  if (req.user.role === USER_ROLES.TEACHER) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    const hasAccess = teacher.assignedCourses.some(
      assignment => assignment.courseId.toString() === assignmentData.courseId
    );
    
    if (!hasAccess) {
      return sendErrorResponse(res, 403, 'You are not assigned to this course');
    }
    
    assignmentData.instructorId = teacher._id;
  }

  // Validate due date
  if (new Date(assignmentData.dueDate) <= new Date()) {
    return sendErrorResponse(res, 400, 'Due date must be in the future');
  }

  const assignment = await Assignment.create(assignmentData);

  // Create submissions for all enrolled students
  if (assignment.status === 'published') {
    await createSubmissionsForStudents(assignment._id);
  }

  // Send notification to students
  if (assignment.status === 'published') {
    await notificationService.sendAssignmentNotification(assignment, 'created');
  }

  sendCreatedResponse(res, assignment, 'Assignment created successfully');
});

/**
 * Get assignment by ID
 */
const getAssignmentById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const assignment = await Assignment.findById(id)
    .populate('courseId', 'title courseCode')
    .populate('instructorId', 'firstName lastName email');

  if (!assignment) {
    return sendNotFoundResponse(res, 'Assignment');
  }

  // Check access permissions
  let hasAccess = false;
  
  if (req.user.role === USER_ROLES.ADMIN) {
    hasAccess = true;
  } else if (req.user.role === USER_ROLES.TEACHER) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    hasAccess = assignment.instructorId.toString() === teacher._id.toString();
  } else if (req.user.role === USER_ROLES.STUDENT) {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      hasAccess = student.enrolledCourses.some(
        enrollment => enrollment.courseId.toString() === assignment.courseId._id.toString() &&
                    enrollment.status === 'active'
      );
    }
  }

  if (!hasAccess) {
    return sendErrorResponse(res, 403, 'You do not have access to this assignment');
  }

  // Get student's submission if applicable
  let submissionData = null;
  if (req.user.role === USER_ROLES.STUDENT) {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      submissionData = await Submission.findOne({
        assignmentId: id,
        studentId: student._id
      });
    }
  }

  sendSuccessResponse(res, 200, 'Assignment retrieved successfully', {
    assignment,
    submission: submissionData
  });
});

/**
 * Update assignment
 */
const updateAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const assignment = await Assignment.findById(id);
  if (!assignment) {
    return sendNotFoundResponse(res, 'Assignment');
  }

  // Check permissions
  if (req.user.role !== USER_ROLES.ADMIN) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (assignment.instructorId.toString() !== teacher._id.toString()) {
      return sendErrorResponse(res, 403, 'You can only update your own assignments');
    }
  }

  // Prevent certain updates after publication
  if (assignment.status === 'published') {
    const restrictedFields = ['maxMarks', 'submissionFormat', 'allowedFileTypes'];
    const hasRestrictedUpdates = restrictedFields.some(field => updates[field] !== undefined);
    
    if (hasRestrictedUpdates) {
      // Check if there are existing submissions
      const submissionCount = await Submission.countDocuments({ assignmentId: id });
      if (submissionCount > 0) {
        return sendErrorResponse(res, 400, 'Cannot modify assignment structure after students have started submissions');
      }
    }
  }

  const updatedAssignment = await Assignment.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate('courseId instructorId');

  // If status changed to published, create submissions for students
  if (updates.status === 'published' && assignment.status !== 'published') {
    await createSubmissionsForStudents(id);
    await notificationService.sendAssignmentNotification(updatedAssignment, 'published');
  }

  sendUpdatedResponse(res, updatedAssignment);
});

/**
 * Delete assignment
 */
const deleteAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const assignment = await Assignment.findById(id);
  if (!assignment) {
    return sendNotFoundResponse(res, 'Assignment');
  }

  // Check permissions
  if (req.user.role !== USER_ROLES.ADMIN) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (assignment.instructorId.toString() !== teacher._id.toString()) {
      return sendErrorResponse(res, 403, 'You can only delete your own assignments');
    }
  }

  // Check if there are submissions
  const submissionCount = await Submission.countDocuments({ assignmentId: id });
  if (submissionCount > 0) {
    return sendErrorResponse(res, 400, 'Cannot delete assignment with existing submissions');
  }

  // Delete assignment files from storage
  if (assignment.resources && assignment.resources.length > 0) {
    for (const resource of assignment.resources) {
      if (resource.url) {
        await fileService.deleteFile(resource.url);
      }
    }
  }

  await Assignment.findByIdAndDelete(id);

  sendDeletedResponse(res, 'Assignment deleted successfully');
});

/**
 * Submit assignment
 */
const submitAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { textContent, urlSubmission } = req.body;

  const assignment = await Assignment.findById(id);
  if (!assignment) {
    return sendNotFoundResponse(res, 'Assignment');
  }

  // Check if student is enrolled
  const student = await Student.findOne({ userId: req.user.id });
  if (!student) {
    return sendErrorResponse(res, 404, 'Student profile not found');
  }

  const isEnrolled = student.enrolledCourses.some(
    enrollment => enrollment.courseId.toString() === assignment.courseId.toString() &&
                 enrollment.status === 'active'
  );

  if (!isEnrolled) {
    return sendErrorResponse(res, 403, 'You are not enrolled in this course');
  }

  // Check submission eligibility
  const canSubmitResult = assignment.canSubmit();
  if (!canSubmitResult.canSubmit) {
    return sendErrorResponse(res, 400, canSubmitResult.reason);
  }

  // Find or create submission
  let submission = await Submission.findOne({
    assignmentId: id,
    studentId: student._id
  });

  if (!submission) {
    submission = new Submission({
      assignmentId: id,
      studentId: student._id,
      submissionType: assignment.submissionFormat
    });
  }

  // Handle file uploads
  let files = [];
  if (req.files && req.files.length > 0) {
    files = await fileService.uploadFiles(req.files, {
      folder: `assignments/${id}/submissions/${student._id}`,
      allowedTypes: assignment.allowedFileTypes,
      maxFileSize: assignment.maxFileSize * 1024 * 1024 // Convert MB to bytes
    });
  }

  // Submit the assignment
  await submission.submit({
    textContent,
    urlSubmission,
    files,
    submissionMetadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      deviceInfo: req.get('User-Agent')
    }
  });

  // Send notification to instructor
  await notificationService.sendSubmissionNotification(submission, assignment);

  sendSuccessResponse(res, 200, 'Assignment submitted successfully', submission);
});

/**
 * Get assignment submissions (for instructors)
 */
const getAssignmentSubmissions = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { 
    page = 1, 
    limit = 20,
    status,
    gradeStatus,
    search 
  } = req.query;

  const assignment = await Assignment.findById(id);
  if (!assignment) {
    return sendNotFoundResponse(res, 'Assignment');
  }

  // Check permissions
  if (req.user.role !== USER_ROLES.ADMIN) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (assignment.instructorId.toString() !== teacher._id.toString()) {
      return sendErrorResponse(res, 403, 'You can only view submissions for your assignments');
    }
  }

  // Build filter
  const filter = { assignmentId: id };
  if (status) filter.status = status;
  if (gradeStatus) filter['grading.status'] = gradeStatus;

  // Execute query
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [submissions, total] = await Promise.all([
    Submission.find(filter)
      .populate('studentId', 'rollNumber firstName lastName email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Submission.countDocuments(filter)
  ]);

  // Add search functionality if needed
  let filteredSubmissions = submissions;
  if (search) {
    filteredSubmissions = submissions.filter(submission => {
      const student = submission.studentId;
      return student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
             student.firstName.toLowerCase().includes(search.toLowerCase()) ||
             student.lastName.toLowerCase().includes(search.toLowerCase()) ||
             student.email.toLowerCase().includes(search.toLowerCase());
    });
  }

  sendPaginatedResponse(res, filteredSubmissions, parseInt(page), parseInt(limit), total, 
    'Assignment submissions retrieved successfully');
});

/**
 * Grade submission
 */
const gradeSubmission = catchAsync(async (req, res) => {
  const { id, submissionId } = req.params;
  const { score, feedback, rubricScores } = req.body;

  const submission = await Submission.findById(submissionId)
    .populate('assignmentId')
    .populate('studentId');

  if (!submission) {
    return sendNotFoundResponse(res, 'Submission');
  }

  // Check permissions
  if (req.user.role !== USER_ROLES.ADMIN) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (submission.assignmentId.instructorId.toString() !== teacher._id.toString()) {
      return sendErrorResponse(res, 403, 'You can only grade submissions for your assignments');
    }
  }

  // Validate score
  if (score > submission.assignmentId.maxMarks) {
    return sendErrorResponse(res, 400, 'Score cannot exceed maximum marks');
  }

  // Grade the submission
  const Teacher = require('../models/Teacher');
  const teacher = await Teacher.findOne({ userId: req.user.id });
  
  await submission.grade({
    score,
    maxScore: submission.assignmentId.maxMarks,
    feedback,
    rubricScores,
    gradedBy: teacher._id
  });

  // Create grade record
  const Grade = require('../models/Grade');
  await Grade.create({
    studentId: submission.studentId._id,
    courseId: submission.assignmentId.courseId,
    assessmentType: 'assignment',
    assessmentId: submission.assignmentId._id,
    scoreObtained: submission.finalScore,
    maxScore: submission.assignmentId.maxMarks,
    weightage: submission.assignmentId.weightage,
    credits: 0, // Assignments typically don't have credits
    gradedBy: teacher._id,
    semester: 'current', // This should be dynamically determined
    academicYear: '2024-2025', // This should be dynamically determined
    comments: feedback
  });

  // Send notification to student
  await notificationService.sendGradeNotification(submission);

  sendSuccessResponse(res, 200, 'Submission graded successfully', submission);
});

/**
 * Helper function to create submissions for all enrolled students
 */
const createSubmissionsForStudents = async (assignmentId) => {
  const assignment = await Assignment.findById(assignmentId).populate('courseId');
  
  const enrolledStudents = await Student.find({
    'enrolledCourses.courseId': assignment.courseId._id,
    'enrolledCourses.status': 'active'
  });

  const submissions = enrolledStudents.map(student => ({
    assignmentId: assignmentId,
    studentId: student._id,
    submissionType: assignment.submissionFormat,
    status: 'not_started'
  }));

  if (submissions.length > 0) {
    await Submission.insertMany(submissions, { ordered: false });
  }
};

module.exports = {
  getAllAssignments,
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission
};

/**
 * Test Controller
 * Handles online testing system with proctoring
 */

const Test = require('../models/Test');
const Question = require('../models/Question');
const Student = require('../models/Student');
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
const testSessionService = require('../services/testSessionService');
const proctoringService = require('../services/proctoringService');

/**
 * Get all tests with filtering
 */
const getAllTests = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    courseId,
    type,
    status,
    search,
    sort = '-createdAt'
  } = req.query;

  const filter = {};
  if (courseId) filter.courseId = courseId;
  if (type) filter.type = type;
  if (status) filter.status = status;

  // Role-based filtering
  if (req.user.role === USER_ROLES.STUDENT) {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      const enrolledCourseIds = student.enrolledCourses
        .filter(enrollment => enrollment.status === 'active')
        .map(enrollment => enrollment.courseId);
      filter.courseId = { $in: enrolledCourseIds };
      filter.status = { $in: ['published', 'active'] };
    }
  } else if (req.user.role === USER_ROLES.TEACHER) {
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
      { testCode: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [tests, total] = await Promise.all([
    Test.find(filter)
      .populate('courseId', 'title courseCode')
      .populate('instructorId', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Test.countDocuments(filter)
  ]);

  // Add test session info for students
  if (req.user.role === USER_ROLES.STUDENT) {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      for (let test of tests) {
        const session = await testSessionService.getStudentSession(test._id, student._id);
        test.sessionStatus = session ? session.status : 'not_started';
        test.attemptsUsed = session ? session.attemptNumber : 0;
        test.canAttempt = test.attemptsUsed < test.configuration.maxAttempts;
      }
    }
  }

  sendPaginatedResponse(res, tests, parseInt(page), parseInt(limit), total);
});

/**
 * Create new test
 */
const createTest = catchAsync(async (req, res) => {
  const testData = req.body;

  // Verify course access for teachers
  if (req.user.role === USER_ROLES.TEACHER) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    const hasAccess = teacher.assignedCourses.some(
      assignment => assignment.courseId.toString() === testData.courseId
    );
    
    if (!hasAccess) {
      return sendErrorResponse(res, 403, 'You are not assigned to this course');
    }
    
    testData.instructorId = teacher._id;
  }

  // Validate schedule dates
  if (new Date(testData.schedule.startDate) >= new Date(testData.schedule.endDate)) {
    return sendErrorResponse(res, 400, 'End date must be after start date');
  }

  if (new Date(testData.schedule.startDate) <= new Date()) {
    return sendErrorResponse(res, 400, 'Start date must be in the future');
  }

  const test = await Test.create(testData);

  sendCreatedResponse(res, test, 'Test created successfully');
});

/**
 * Get test by ID
 */
const getTestById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const test = await Test.findById(id)
    .populate('courseId', 'title courseCode')
    .populate('instructorId', 'firstName lastName email')
    .populate('questions.questionId');

  if (!test) {
    return sendNotFoundResponse(res, 'Test');
  }

  // Check access permissions
  let hasAccess = false;
  
  if (req.user.role === USER_ROLES.ADMIN) {
    hasAccess = true;
  } else if (req.user.role === USER_ROLES.TEACHER) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    hasAccess = test.instructorId.toString() === teacher._id.toString();
  } else if (req.user.role === USER_ROLES.STUDENT) {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      hasAccess = student.enrolledCourses.some(
        enrollment => enrollment.courseId.toString() === test.courseId._id.toString() &&
                    enrollment.status === 'active'
      );
    }
  }

  if (!hasAccess) {
    return sendErrorResponse(res, 403, 'You do not have access to this test');
  }

  // For students, hide question details and correct answers
  let responseData = test;
  if (req.user.role === USER_ROLES.STUDENT) {
    responseData = {
      ...test.toObject(),
      questions: test.questions.map(q => ({
        questionId: q.questionId._id,
        marks: q.marks,
        orderIndex: q.orderIndex
      }))
    };
    
    // Remove sensitive information
    delete responseData.configuration.password;
  }

  sendSuccessResponse(res, 200, 'Test retrieved successfully', responseData);
});

/**
 * Start test session
 */
const startTest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const test = await Test.findById(id).populate('questions.questionId');
  if (!test) {
    return sendNotFoundResponse(res, 'Test');
  }

  // Check if test is active
  if (!test.isActive) {
    return sendErrorResponse(res, 400, 'Test is not currently active');
  }

  const student = await Student.findOne({ userId: req.user.id });
  if (!student) {
    return sendErrorResponse(res, 404, 'Student profile not found');
  }

  // Check eligibility
  const eligibilityResult = await test.isEligible(student._id);
  if (!eligibilityResult.eligible) {
    return sendErrorResponse(res, 403, eligibilityResult.reason);
  }

  // Check password if required
  if (test.configuration.requirePassword && password !== test.configuration.password) {
    return sendErrorResponse(res, 401, 'Invalid test password');
  }

  // Check existing sessions and attempts
  const existingSession = await testSessionService.getActiveSession(test._id, student._id);
  if (existingSession) {
    return sendErrorResponse(res, 400, 'You already have an active test session');
  }

  const sessionsCount = await testSessionService.getSessionCount(test._id, student._id);
  if (sessionsCount >= test.configuration.maxAttempts) {
    return sendErrorResponse(res, 400, 'Maximum attempts reached');
  }

  // Create test session
  const session = await testSessionService.createSession({
    testId: test._id,
    studentId: student._id,
    duration: test.configuration.duration,
    questions: test.questions,
    shuffleQuestions: test.configuration.shuffleQuestions,
    proctoring: test.proctoring.enabled
  });

  // Initialize proctoring if enabled
  if (test.proctoring.enabled) {
    await proctoringService.initializeSession(session._id, {
      requireCamera: test.proctoring.requireCamera,
      requireMicrophone: test.proctoring.requireMicrophone,
      detectTabSwitch: test.proctoring.detectTabSwitch,
      flaggingRules: test.proctoring.flaggingRules
    });
  }

  sendSuccessResponse(res, 200, 'Test session started successfully', {
    sessionId: session._id,
    questions: session.questions,
    duration: session.remainingTime,
    proctoring: test.proctoring.enabled
  });
});

/**
 * Submit answer
 */
const submitAnswer = catchAsync(async (req, res) => {
  const { id, sessionId } = req.params;
  const { questionId, answer } = req.body;

  const session = await testSessionService.getSession(sessionId);
  if (!session) {
    return sendNotFoundResponse(res, 'Test session');
  }

  // Verify session belongs to current user
  const student = await Student.findOne({ userId: req.user.id });
  if (session.studentId.toString() !== student._id.toString()) {
    return sendErrorResponse(res, 403, 'Invalid session access');
  }

  // Check session status and time
  if (session.status !== 'active') {
    return sendErrorResponse(res, 400, 'Session is not active');
  }

  if (session.remainingTime <= 0) {
    return sendErrorResponse(res, 400, 'Session time has expired');
  }

  // Submit answer
  const result = await testSessionService.submitAnswer(sessionId, questionId, answer);

  // Log proctoring event if enabled
  if (session.proctoringEnabled) {
    await proctoringService.logEvent(sessionId, 'answer_submitted', {
      questionId,
      timestamp: new Date()
    });
  }

  sendSuccessResponse(res, 200, 'Answer submitted successfully', result);
});

/**
 * Submit test
 */
const submitTest = catchAsync(async (req, res) => {
  const { id, sessionId } = req.params;

  const session = await testSessionService.getSession(sessionId);
  if (!session) {
    return sendNotFoundResponse(res, 'Test session');
  }

  // Verify session belongs to current user
  const student = await Student.findOne({ userId: req.user.id });
  if (session.studentId.toString() !== student._id.toString()) {
    return sendErrorResponse(res, 403, 'Invalid session access');
  }

  if (session.status === 'completed') {
    return sendErrorResponse(res, 400, 'Test already submitted');
  }

  // Submit test session
  const result = await testSessionService.submitSession(sessionId);

  // Generate results if auto-grading is enabled
  const test = await Test.findById(id);
  if (test.grading.autoGrade) {
    await testSessionService.gradeSession(sessionId);
  }

  // End proctoring session
  if (session.proctoringEnabled) {
    await proctoringService.endSession(sessionId);
  }

  sendSuccessResponse(res, 200, 'Test submitted successfully', {
    score: result.totalScore,
    totalMarks: result.totalMarks,
    percentage: result.percentage,
    showResults: test.configuration.showResultImmediately
  });
});

/**
 * Get test results
 */
const getTestResults = catchAsync(async (req, res) => {
  const { id } = req.params;

  const test = await Test.findById(id);
  if (!test) {
    return sendNotFoundResponse(res, 'Test');
  }

  let results;

  if (req.user.role === USER_ROLES.STUDENT) {
    // Student viewing their own results
    const student = await Student.findOne({ userId: req.user.id });
    results = await testSessionService.getStudentResults(id, student._id);
  } else {
    // Teacher/Admin viewing all results
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    if (req.user.role !== USER_ROLES.ADMIN && 
        test.instructorId.toString() !== teacher._id.toString()) {
      return sendErrorResponse(res, 403, 'You can only view results for your tests');
    }
    
    results = await testSessionService.getAllResults(id);
  }

  sendSuccessResponse(res, 200, 'Test results retrieved successfully', results);
});

/**
 * Add questions to test
 */
const addQuestions = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { questions } = req.body; // Array of {questionId, marks, orderIndex}

  const test = await Test.findById(id);
  if (!test) {
    return sendNotFoundResponse(res, 'Test');
  }

  // Check permissions
  if (req.user.role !== USER_ROLES.ADMIN) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (test.instructorId.toString() !== teacher._id.toString()) {
      return sendErrorResponse(res, 403, 'You can only modify your own tests');
    }
  }

  // Validate questions exist
  const questionIds = questions.map(q => q.questionId);
  const existingQuestions = await Question.find({ _id: { $in: questionIds } });
  
  if (existingQuestions.length !== questionIds.length) {
    return sendErrorResponse(res, 400, 'Some questions do not exist');
  }

  // Add questions to test
  for (const questionData of questions) {
    await test.addQuestion(questionData.questionId, questionData.marks, questionData.orderIndex);
  }

  sendSuccessResponse(res, 200, 'Questions added successfully', test);
});

/**
 * Remove question from test
 */
const removeQuestion = catchAsync(async (req, res) => {
  const { id, questionId } = req.params;

  const test = await Test.findById(id);
  if (!test) {
    return sendNotFoundResponse(res, 'Test');
  }

  // Check permissions
  if (req.user.role !== USER_ROLES.ADMIN) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (test.instructorId.toString() !== teacher._id.toString()) {
      return sendErrorResponse(res, 403, 'You can only modify your own tests');
    }
  }

  await test.removeQuestion(questionId);

  sendSuccessResponse(res, 200, 'Question removed successfully', test);
});

/**
 * Publish test
 */
const publishTest = catchAsync(async (req, res) => {
  const { id } = req.params;

  const test = await Test.findById(id);
  if (!test) {
    return sendNotFoundResponse(res, 'Test');
  }

  // Check permissions
  if (req.user.role !== USER_ROLES.ADMIN) {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (test.instructorId.toString() !== teacher._id.toString()) {
      return sendErrorResponse(res, 403, 'You can only publish your own tests');
    }
  }

  await test.publish();

  // Send notification to students
  const notificationService = require('../services/notificationService');
  await notificationService.sendTestNotification(test, 'published');

  sendSuccessResponse(res, 200, 'Test published successfully', test);
});

module.exports = {
  getAllTests,
  createTest,
  getTestById,
  startTest,
  submitAnswer,
  submitTest,
  getTestResults,
  addQuestions,
  removeQuestion,
  publishTest
};


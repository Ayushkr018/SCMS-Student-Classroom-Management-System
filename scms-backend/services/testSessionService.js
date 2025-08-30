/**
 * Test Session Service
 * Manages the lifecycle of a student's test attempt, including timing, answers, and grading.
 */

const { Submission, Test, Student, Grade, Question } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { default: mongoose } = require('mongoose');

class TestSessionService {

  /**
   * Creates a new test session for a student.
   * @param {Object} options - Session creation options.
   * @returns {Promise<Object>} The created session document.
   */
  async createSession(options) {
    const { testId, studentId, duration, questions, shuffleQuestions } = options;

    // Shuffle questions if required
    let sessionQuestions = [...questions];
    if (shuffleQuestions) {
      sessionQuestions.sort(() => Math.random() - 0.5);
    }

    const attemptCount = await this.getSessionCount(testId, studentId);

    const session = await Submission.create({
      studentId,
      assignmentId: testId, // Using assignmentId to reference the test
      submissionType: 'test_attempt',
      status: 'in_progress',
      attemptNumber: attemptCount + 1,
      submittedAt: new Date(), // Using submittedAt as startedAt for tests
      answers: [], // Initialize empty answers array
      grading: {
        status: 'not_graded'
      }
    });
    
    // We can store session-specific data like question order in a separate model if needed,
    // but for now, we'll rely on the client to manage it.

    return session;
  }

  /**
   * Retrieves a session by its ID.
   */
  async getSession(sessionId) {
    return Submission.findById(sessionId);
  }

  /**
   * Finds an active (in_progress) session for a student and test.
   */
  async getActiveSession(testId, studentId) {
    return Submission.findOne({
      assignmentId: testId,
      studentId,
      status: 'in_progress'
    });
  }
  
  /**
   * Counts the number of sessions a student has for a test.
   */
  async getSessionCount(testId, studentId) {
    return Submission.countDocuments({
      assignmentId: testId,
      studentId
    });
  }

  /**
   * Submits a single answer for a question in a session.
   */
  async submitAnswer(sessionId, questionId, answer) {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new AppError('Test session not found', 404);
    }
    if (session.status !== 'in_progress') {
      throw new AppError('This session is no longer active', 400);
    }

    // Check remaining time
    const test = await Test.findById(session.assignmentId);
    const timeElapsed = (new Date() - new Date(session.submittedAt)) / 1000 / 60; // in minutes
    if (timeElapsed > test.configuration.duration) {
        await this.submitSession(sessionId); // Auto-submit if time is up
        throw new AppError('Time has expired. Your test has been submitted.', 400);
    }
    
    // Find if an answer for this question already exists
    const existingAnswerIndex = session.answers.findIndex(
      a => a.questionId.toString() === questionId
    );

    if (existingAnswerIndex > -1) {
      // Update existing answer
      session.answers[existingAnswerIndex].answer = answer;
      session.answers[existingAnswerIndex].timestamp = new Date();
    } else {
      // Add new answer
      session.answers.push({ questionId, answer, timestamp: new Date() });
    }

    await session.save();
    return { success: true, message: 'Answer saved' };
  }

  /**
   * Finalizes and submits the entire test session.
   */
  async submitSession(sessionId) {
    const session = await Submission.findByIdAndUpdate(
      sessionId,
      { status: 'submitted', submittedAt: new Date() },
      { new: true }
    );

    if (!session) {
      throw new AppError('Test session not found', 404);
    }
    
    // Trigger auto-grading
    await this.gradeSession(sessionId);

    return session;
  }

  /**
   * Grades a completed test session.
   */
  async gradeSession(sessionId) {
    const session = await Submission.findById(sessionId).populate({
        path: 'assignmentId',
        populate: {
            path: 'questions.questionId'
        }
    });

    if (!session || session.status !== 'submitted') {
      throw new AppError('Session not found or not ready for grading', 400);
    }

    const test = session.assignmentId;
    let totalScore = 0;

    for (const answer of session.answers) {
      const questionInfo = test.questions.find(
        q => q.questionId._id.toString() === answer.questionId.toString()
      );

      if (questionInfo) {
        const result = questionInfo.questionId.checkAnswer(answer.answer);
        answer.isCorrect = result.isCorrect;
        answer.score = result.score;
        totalScore += result.score;
      }
    }
    
    // Update submission with grade
    session.grading.score = totalScore;
    session.grading.maxScore = test.configuration.totalMarks;
    session.grading.status = 'graded';
    session.grading.gradedAt = new Date();
    session.grading.autoGraded = true;
    
    // Mark the answers array as modified
    session.markModified('answers');
    await session.save();

    // Create a corresponding Grade document
    await Grade.create({
        studentId: session.studentId,
        courseId: test.courseId,
        assessmentType: 'test',
        assessmentId: test._id,
        scoreObtained: totalScore,
        maxScore: test.configuration.totalMarks,
        weightage: 0, // Tests might have a separate weightage system
        credits: 0,
        gradedBy: test.instructorId,
        semester: test.schedule.semester,
        academicYear: test.schedule.academicYear
    });

    return session;
  }

  /**
   * Retrieves all test results for a student for a specific test.
   */
  async getStudentResults(testId, studentId) {
    return Submission.find({
      assignmentId: testId,
      studentId: studentId,
      status: { $in: ['submitted', 'graded'] }
    }).sort('-attemptNumber');
  }

  /**
   * Retrieves all test results for all students for a specific test.
   */
  async getAllResults(testId) {
    return Submission.find({
      assignmentId: testId,
      status: { $in: ['submitted', 'graded'] }
    }).populate({
        path: 'studentId',
        populate: {
            path: 'userId',
            select: 'firstName lastName email'
        }
    }).sort('studentId');
  }
}

module.exports = new TestSessionService();

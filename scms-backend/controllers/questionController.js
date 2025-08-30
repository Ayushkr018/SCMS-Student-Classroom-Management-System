/**
 * Question Controller
 * Handles all operations related to the question bank
 */

const {
    Question,
    Course,
    Teacher
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
 * Get all questions with filtering and pagination
 */
const getAllQuestions = catchAsync(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        courseId,
        type,
        difficulty,
        topic,
        search,
        sort = '-createdAt'
    } = req.query;

    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = {
        $regex: topic,
        $options: 'i'
    };

    // Non-admins/teachers can only see published questions
    if (req.user.role !== USER_ROLES.ADMIN) {
        filter.status = 'published';
    }

    if (search) {
        filter.questionText = {
            $regex: search,
            $options: 'i'
        };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, total] = await Promise.all([
        Question.find(filter)
        .populate('courseId', 'title courseCode')
        .populate('createdBy', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
        Question.countDocuments(filter)
    ]);

    sendPaginatedResponse(res, questions, parseInt(page), parseInt(limit), total);
});

/**
 * Create a new question
 */
const createQuestion = catchAsync(async (req, res) => {
    const questionData = req.body;

    const teacher = await Teacher.findOne({
        userId: req.user.id
    });
    if (!teacher) {
        return sendErrorResponse(res, 404, 'Teacher profile not found for the current user.');
    }

    questionData.createdBy = teacher._id;

    const question = await Question.create(questionData);
    sendCreatedResponse(res, question, 'Question created successfully.');
});

/**
 * Get a single question by ID
 */
const getQuestionById = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;

    const question = await Question.findById(id)
        .populate('courseId', 'title courseCode')
        .populate('createdBy', 'firstName lastName email');

    if (!question) {
        return sendNotFoundResponse(res, 'Question');
    }

    // Permission check for draft questions
    if (question.status === 'draft' && req.user.role !== USER_ROLES.ADMIN) {
        if (question.createdBy._id.toString() !== req.user.id.toString()) {
            return sendErrorResponse(res, 403, 'You do not have permission to view this draft question.');
        }
    }

    sendSuccessResponse(res, 200, 'Question retrieved successfully', question);
});

/**
 * Update a question
 */
const updateQuestion = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const updates = req.body;

    const question = await Question.findById(id);
    if (!question) {
        return sendNotFoundResponse(res, 'Question');
    }

    // Permission check
    if (req.user.role !== USER_ROLES.ADMIN) {
        const teacher = await Teacher.findOne({
            userId: req.user.id
        });
        if (!question.createdBy.equals(teacher._id)) {
            return sendErrorResponse(res, 403, 'You can only update your own questions.');
        }
    }

    // Prevent updates if question is in use (basic check)
    if (question.usage.timesUsed > 0) {
        // More complex logic could be added here to check active tests
        return sendErrorResponse(res, 400, 'Cannot update a question that has already been used in a test.');
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    });

    sendUpdatedResponse(res, updatedQuestion);
});

/**
 * Delete a question
 */
const deleteQuestion = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;

    const question = await Question.findById(id);
    if (!question) {
        return sendNotFoundResponse(res, 'Question');
    }

    // Permission check
    if (req.user.role !== USER_ROLES.ADMIN) {
        const teacher = await Teacher.findOne({
            userId: req.user.id
        });
        if (!question.createdBy.equals(teacher._id)) {
            return sendErrorResponse(res, 403, 'You can only delete your own questions.');
        }
    }

    // Prevent deletion if question is in use
    if (question.usage.timesUsed > 0) {
        return sendErrorResponse(res, 400, 'Cannot delete a question that has been used. Consider archiving it instead.');
    }

    await Question.findByIdAndDelete(id);

    sendDeletedResponse(res, 'Question deleted successfully.');
});

/**
 * Get random questions for a test
 */
const getRandomQuestions = catchAsync(async (req, res) => {
    const {
        courseId,
        count,
        difficulty,
        type,
        topic
    } = req.body;

    if (!courseId || !count) {
        return sendErrorResponse(res, 400, 'Course ID and question count are required.');
    }

    const criteria = {
        courseId,
        status: 'published'
    };
    if (difficulty) criteria.difficulty = difficulty;
    if (type) criteria.type = type;
    if (topic) criteria.topic = topic;

    const questions = await Question.getRandomQuestions(criteria, parseInt(count));

    sendSuccessResponse(res, 200, `${questions.length} random questions retrieved.`, questions);
});


module.exports = {
    getAllQuestions,
    createQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    getRandomQuestions
};

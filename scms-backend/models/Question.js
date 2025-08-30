/**
 * Question Model
 * A comprehensive model for the question bank, supporting various question types for tests and quizzes.
 */

const mongoose = require('mongoose');

// Assuming QUESTION_TYPES is defined in a constants file, e.g., { MULTIPLE_CHOICE: 'mcq', TRUE_FALSE: 'tf', ... }
// const { QUESTION_TYPES } = require('../utils/constants'); 

const questionSchema = new mongoose.Schema({
  // Basic Information
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [2000, 'Question text cannot exceed 2000 characters']
  },
  
  type: {
    type: String,
    // enum: Object.values(QUESTION_TYPES),
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_blank', 'matching'],
    required: [true, 'Question type is required']
  },
  
  // Course and Topic Information
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required'],
    index: true
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Creator ID is required']
  },
  
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true
  },
  
  subtopic: {
    type: String,
    trim: true
  },
  
  // Difficulty and Classification
  difficulty: {
    type: String,
    enum: ['very_easy', 'easy', 'medium', 'hard', 'very_hard'],
    required: [true, 'Difficulty level is required']
  },
  
  bloomsLevel: {
    type: String,
    enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
    required: [true, 'Bloom\'s taxonomy level is required']
  },
  
  // Question Content (Flexible based on type)
  questionData: {
    // For multiple choice questions (mcq)
    options: [{
      text: {
        type: String,
        required: function() { return this.parent().parent().type === 'multiple_choice'; }
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    
    // For true/false questions (tf)
    correctAnswer: {
      type: Boolean,
      required: function() { return this.parent().type === 'true_false'; }
    },
    
    // For short answer and essay questions
    sampleAnswer: String,
    keyPoints: [String],
    
    // For fill in the blank
    blanks: [{
      position: Number,
      correctAnswers: [String], // Multiple acceptable answers
      caseSensitive: {
        type: Boolean,
        default: false
      }
    }],
    
    // For matching questions
    pairs: [{
      left: String,
      right: String
    }]
  },
  
  // Media and Resources
  media: [{
    type: {
      type: String,
      enum: ['image', 'audio', 'video', 'document']
    },
    url: String,
    caption: String,
    altText: String
  }],
  
  // Explanation and Feedback
  explanation: {
    type: String,
    maxlength: [1000, 'Explanation cannot exceed 1000 characters']
  },
  
  hints: [String],
  
  // Scoring
  defaultMarks: {
    type: Number,
    required: [true, 'Default marks is required'],
    min: [0.5, 'Marks must be at least 0.5']
  },
  
  negativeMarking: {
    type: Number,
    default: 0,
    min: [0, 'Negative marking cannot be negative']
  },
  
  // Usage Statistics
  usage: {
    timesUsed: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    difficultyIndex: { type: Number, default: 0 }, // Calculated based on student performance
    discriminationIndex: { type: Number, default: 0 } // How well it discriminates
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true
  }],
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'under_review'],
    default: 'draft',
    index: true
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  language: {
    type: String,
    default: 'en-US'
  },
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  
  previousVersions: [{
    version: Number,
    questionText: String,
    modifiedAt: Date,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- VIRTUAL PROPERTIES ---
questionSchema.virtual('isMultipleChoice').get(function() {
  return this.type === 'multiple_choice';
});

questionSchema.virtual('correctOptions').get(function() {
  if (this.type === 'multiple_choice' && this.questionData && this.questionData.options) {
    return this.questionData.options.filter(option => option.isCorrect);
  }
  return [];
});

// --- INSTANCE METHODS ---
questionSchema.methods.checkAnswer = function(studentAnswer) {
  let isCorrect = false;
  
  switch (this.type) {
    case 'multiple_choice':
      const correctOptionIds = this.questionData.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt._id.toString());
      
      if (Array.isArray(studentAnswer)) { // For multi-select
        const studentAnswerSet = new Set(studentAnswer.map(id => id.toString()));
        isCorrect = correctOptionIds.length === studentAnswerSet.size && correctOptionIds.every(id => studentAnswerSet.has(id));
      } else { // For single-select
        isCorrect = correctOptionIds.includes(studentAnswer.toString());
      }
      break;
      
    case 'true_false':
      isCorrect = studentAnswer === this.questionData.correctAnswer;
      break;
      
    case 'fill_blank':
      isCorrect = this.questionData.blanks.every((blank, index) => {
        const studentBlankAnswer = studentAnswer[index];
        const processedStudentAnswer = blank.caseSensitive ? studentBlankAnswer : studentBlankAnswer.toLowerCase();
        const correctAnswers = blank.correctAnswers.map(ans => blank.caseSensitive ? ans : ans.toLowerCase());
        return correctAnswers.includes(processedStudentAnswer);
      });
      break;
    
    // Note: 'short_answer', 'essay', and 'matching' would require manual grading or more complex logic
  }
  
  const score = isCorrect ? this.defaultMarks : -this.negativeMarking;
  const feedback = isCorrect ? 'Correct!' : 'Incorrect.';
  
  return { isCorrect, score, feedback };
};

questionSchema.methods.updateUsageStats = function({ wasCorrect }) {
  const total = this.usage.timesUsed;
  const correctCount = (this.usage.difficultyIndex * total) + (wasCorrect ? 1 : 0);
  
  this.usage.timesUsed += 1;
  this.usage.difficultyIndex = correctCount / this.usage.timesUsed;
  
  return this.save();
};

// --- STATIC METHODS ---
questionSchema.statics.findByCourse = function(courseId, options = {}) {
  const query = { courseId, status: 'published' };
  if (options.topic) query.topic = options.topic;
  if (options.difficulty) query.difficulty = options.difficulty;
  if (options.type) query.type = options.type;
  
  return this.find(query);
};

questionSchema.statics.getRandomQuestions = function(criteria, count) {
  return this.aggregate([
    { $match: { status: 'published', ...criteria } },
    { $sample: { size: count } }
  ]);
};

// --- MIDDLEWARE (HOOKS) ---
questionSchema.pre('save', function(next) {
  if (this.isModified('type')) {
    // When type changes, ensure old data doesn't conflict
    this.questionData = {};
  }

  if (this.type === 'multiple_choice') {
    if (!this.questionData.options || this.questionData.options.length < 2) {
      return next(new Error('Multiple choice questions must have at least 2 options.'));
    }
    const correctOptions = this.questionData.options.filter(opt => opt.isCorrect);
    if (correctOptions.length === 0) {
      return next(new Error('Multiple choice questions must have at least one correct option.'));
    }
  }
  
  next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

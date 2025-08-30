/**
 * Question Model
 * Question bank for tests and quizzes
 */

const mongoose = require('mongoose');
const { QUESTION_TYPES } = require('../utils/constants');

const questionSchema = new mongoose.Schema({
  // Basic Information
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [2000, 'Question text cannot exceed 2000 characters']
  },
  
  type: {
    type: String,
    enum: Object.values(QUESTION_TYPES),
    required: [true, 'Question type is required']
  },
  
  // Course and Topic Information
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
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
  
  // Question Content
  questionData: {
    // For multiple choice questions
    options: [{
      text: {
        type: String,
        required: function() {
          return this.parent().type === QUESTION_TYPES.MULTIPLE_CHOICE;
        }
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    
    // For true/false questions
    correctAnswer: {
      type: Boolean,
      required: function() {
        return this.type === QUESTION_TYPES.TRUE_FALSE;
      }
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
    alt: String
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
    timesUsed: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    difficultyIndex: {
      type: Number,
      default: 0 // Calculated based on student performance
    },
    discriminationIndex: {
      type: Number,
      default: 0 // How well it discriminates between high/low performers
    }
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'under_review'],
    default: 'draft'
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  language: {
    type: String,
    default: 'English'
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

// Indexes
questionSchema.index({ courseId: 1, topic: 1 });
questionSchema.index({ type: 1, difficulty: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ tags: 1 });

// Virtual properties
questionSchema.virtual('isMultipleChoice').get(function() {
  return this.type === QUESTION_TYPES.MULTIPLE_CHOICE;
});

questionSchema.virtual('correctOptions').get(function() {
  if (this.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
    return this.questionData.options.filter(option => option.isCorrect);
  }
  return [];
});

// Instance methods
questionSchema.methods.checkAnswer = function(studentAnswer) {
  let isCorrect = false;
  let score = 0;
  let feedback = '';
  
  switch (this.type) {
    case QUESTION_TYPES.MULTIPLE_CHOICE:
      const correctOptionIds = this.questionData.options
        .filter(option => option.isCorrect)
        .map(option => option._id.toString());
      
      if (Array.isArray(studentAnswer)) {
        // Multiple correct answers
        const studentAnswerIds = studentAnswer.map(id => id.toString());
        isCorrect = correctOptionIds.every(id => studentAnswerIds.includes(id)) &&
                   studentAnswerIds.every(id => correctOptionIds.includes(id));
      } else {
        // Single correct answer
        isCorrect = correctOptionIds.includes(studentAnswer.toString());
      }
      break;
      
    case QUESTION_TYPES.TRUE_FALSE:
      isCorrect = studentAnswer === this.questionData.correctAnswer;
      break;
      
    case QUESTION_TYPES.FILL_BLANK:
      // Check each blank
      let correctBlanks = 0;
      this.questionData.blanks.forEach((blank, index) => {
        const studentBlankAnswer = studentAnswer[index];
        const correctAnswers = blank.correctAnswers.map(ans => 
          blank.caseSensitive ? ans : ans.toLowerCase()
        );
        const studentAnswerProcessed = blank.caseSensitive ? 
          studentBlankAnswer : studentBlankAnswer.toLowerCase();
        
        if (correctAnswers.includes(studentAnswerProcessed)) {
          correctBlanks++;
        }
      });
      isCorrect = correctBlanks === this.questionData.blanks.length;
      break;
  }
  
  if (isCorrect) {
    score = this.defaultMarks;
    feedback = 'Correct!';
  } else {
    score = -this.negativeMarking;
    feedback = 'Incorrect.';
  }
  
  return { isCorrect, score, feedback };
};

questionSchema.methods.updateUsageStats = function(wasCorrect, totalStudents, correctStudents) {
  this.usage.timesUsed += 1;
  this.usage.difficultyIndex = correctStudents / totalStudents;
  return this.save();
};

// Static methods
questionSchema.statics.findByCourse = function(courseId, options = {}) {
  const query = { courseId, status: 'published' };
  if (options.topic) query.topic = options.topic;
  if (options.difficulty) query.difficulty = options.difficulty;
  if (options.type) query.type = options.type;
  
  return this.find(query);
};

questionSchema.statics.getRandomQuestions = function(criteria, count) {
  return this.aggregate([
    { $match: criteria },
    { $sample: { size: count } }
  ]);
};

// Pre-save validation
questionSchema.pre('save', function(next) {
  // Validate question data based on type
  if (this.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
    if (!this.questionData.options || this.questionData.options.length < 2) {
      return next(new Error('Multiple choice questions must have at least 2 options'));
    }
    
    const correctOptions = this.questionData.options.filter(opt => opt.isCorrect);
    if (correctOptions.length === 0) {
      return next(new Error('Multiple choice questions must have at least one correct option'));
    }
  }
  
  next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

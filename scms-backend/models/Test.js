/**
 * Test Model
 * Comprehensive test and exam management system for the SCMS.
 */

const mongoose = require('mongoose');
const { TEST_TYPES, TEST_STATUS } = require('../utils/constants');

const testSchema = new mongoose.Schema({
  // Basic Test Information
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true,
    maxlength: [200, 'Test title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  testCode: {
    type: String,
    unique: true,
    uppercase: true,
    required: [true, 'Test code is required']
  },
  
  type: {
    type: String,
    enum: Object.values(TEST_TYPES),
    required: [true, 'Test type is required']
  },
  
  // Course and Instructor Information
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model for the instructor
    required: [true, 'Instructor ID is required']
  },
  
  // Test Configuration
  configuration: {
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1, 'Total marks must be at least 1']
    },
    
    passingMarks: {
      type: Number,
      required: [true, 'Passing marks is required'],
      min: [0, 'Passing marks cannot be negative']
    },
    
    duration: {
      type: Number,
      required: [true, 'Test duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute']
    },
    
    totalQuestions: {
      type: Number,
      default: 0,
      min: [0, 'Total questions cannot be negative']
    },
    
    questionsToAttempt: {
      type: Number,
      validate: {
        validator: function(value) {
          return !value || value <= this.configuration.totalQuestions;
        },
        message: 'Questions to attempt cannot exceed total questions'
      }
    },
    
    maxAttempts: {
      type: Number,
      default: 1,
      min: [1, 'Maximum attempts must be at least 1']
    },
    
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true },
    showResultImmediately: { type: Boolean, default: false },
    allowReview: { type: Boolean, default: true },
    allowBackNavigation: { type: Boolean, default: true },
    
    requirePassword: { type: Boolean, default: false },
    password: { type: String, select: false }
  },
  
  // Scheduling
  schedule: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    
    timezone: { type: String, default: 'Asia/Kolkata' },
    lateSubmissionAllowed: { type: Boolean, default: false },
    
    lateSubmissionPenalty: {
      type: Number,
      default: 0,
      min: [0, 'Penalty cannot be negative'],
      max: [100, 'Penalty cannot exceed 100%']
    },
    
    extendedTimeLimit: {
      type: Number,
      default: 0,
      min: [0, 'Extended time cannot be negative']
    }
  },
  
  // Eligibility and Access Control
  eligibility: {
    targetStudents: {
      type: String,
      enum: ['all', 'specific', 'groups'],
      default: 'all'
    },
    
    specificStudents: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Referencing the User model for students
      }
    }],
    
    studentGroups: [{
      semester: Number,
      branch: String,
      section: String
    }],
    
    prerequisites: [{
      testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
      },
      minimumScore: {
        type: Number,
        min: [0, 'Minimum score cannot be negative']
      }
    }]
  },
  
  // Question Management
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    
    marks: {
      type: Number,
      required: [true, 'Question marks are required'],
      min: [0, 'Marks cannot be negative']
    },
    
    negativeMarking: {
      type: Number,
      default: 0,
      min: [0, 'Negative marking cannot be negative']
    },
    
    isOptional: { type: Boolean, default: false },
    orderIndex: { type: Number, required: true }
  }],
  
  // Instructions and Guidelines
  instructions: {
    general: [String],
    specific: [String],
    technical: [String],
    
    warningMessages: {
      timeWarning: { type: String, default: 'You have 5 minutes remaining' },
      navigationWarning: { type: String, default: 'Are you sure you want to navigate away?' },
      submitWarning: { type: String, default: 'Are you sure you want to submit the test?' }
    }
  },
  
  // Proctoring Settings
  proctoring: {
    enabled: { type: Boolean, default: false },
    requireCamera: { type: Boolean, default: false },
    requireMicrophone: { type: Boolean, default: false },
    requireScreenShare: { type: Boolean, default: false },
    detectTabSwitch: { type: Boolean, default: false },
    preventCopyPaste: { type: Boolean, default: true },
    preventRightClick: { type: Boolean, default: true },
    fullScreenMode: { type: Boolean, default: false },
    
    flaggingRules: [{
      rule: {
        type: String,
        enum: ['tab_switch', 'window_blur', 'copy_paste', 'right_click', 'suspicious_movement']
      },
      threshold: Number,
      action: {
        type: String,
        enum: ['warn', 'flag', 'terminate'],
        default: 'warn'
      }
    }]
  },
  
  // Results and Analytics
  results: {
    totalAttempts: { type: Number, default: 0 },
    completedAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0, min: [0, 'Average score cannot be negative'] },
    highestScore: { type: Number, default: 0 },
    lowestScore: { type: Number, default: 0 },
    
    passRate: {
      type: Number,
      default: 0,
      min: [0, 'Pass rate cannot be negative'],
      max: [100, 'Pass rate cannot exceed 100%']
    },
    
    difficulty: {
      type: String,
      enum: ['very_easy', 'easy', 'moderate', 'hard', 'very_hard'],
      default: 'moderate'
    }
  },
  
  // Status and Metadata
  status: {
    type: String,
    enum: Object.values(TEST_STATUS),
    default: 'draft'
  },
  
  version: {
    type: Number,
    default: 1,
    min: [1, 'Version must be at least 1']
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Grading and Feedback
  grading: {
    autoGrade: { type: Boolean, default: true },
    manualReviewRequired: { type: Boolean, default: false },
    
    releaseGrades: {
      type: String,
      enum: ['immediately', 'after_due_date', 'manual', 'never'],
      default: 'after_due_date'
    },
    
    showCorrectAnswers: { type: Boolean, default: true },
    showExplanations: { type: Boolean, default: true },
    allowDiscussion: { type: Boolean, default: false }
  },
  
  // Resources and Materials
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'image', 'video', 'link', 'document']
    },
    url: String,
    description: String,
    isRequired: Boolean
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- INDEXES ---
testSchema.index({ testCode: 1 });
testSchema.index({ courseId: 1, status: 1 });
testSchema.index({ instructorId: 1 });
testSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });
testSchema.index({ type: 1, status: 1 });

// --- VIRTUAL PROPERTIES ---
testSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         now >= this.schedule.startDate && 
         now <= this.schedule.endDate;
});

testSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.status === 'published' && now < this.schedule.startDate;
});

testSchema.virtual('isCompleted').get(function() {
  const now = new Date();
  return now > this.schedule.endDate || this.status === 'completed';
});

testSchema.virtual('durationInHours').get(function() {
  if (!this.configuration.duration) return 0;
  return Math.round(this.configuration.duration / 60 * 100) / 100;
});

testSchema.virtual('passPercentage').get(function() {
  if (!this.configuration.totalMarks || !this.configuration.passingMarks) return 0;
  return Math.round((this.configuration.passingMarks / this.configuration.totalMarks) * 100);
});

// --- INSTANCE METHODS ---
testSchema.methods.isEligible = async function(studentId) {
  if (this.eligibility.targetStudents === 'all') {
    return { eligible: true };
  }
  
  if (this.eligibility.targetStudents === 'specific') {
    const isSpecific = this.eligibility.specificStudents.some(
      student => student.studentId.toString() === studentId.toString()
    );
    return { eligible: isSpecific, reason: !isSpecific ? 'Not in specific student list' : null };
  }
  
  // Additional eligibility checks for 'groups' would be implemented here
  return { eligible: true };
};

testSchema.methods.addQuestion = function(questionData) {
  const { questionId, marks, orderIndex } = questionData;
  const existingQuestion = this.questions.find(
    q => q.questionId.toString() === questionId.toString()
  );
  
  if (existingQuestion) {
    throw new Error('Question already added to this test');
  }
  
  this.questions.push({
    questionId,
    marks,
    orderIndex: orderIndex !== undefined ? orderIndex : this.questions.length + 1
  });
  
  this.configuration.totalQuestions = this.questions.length;
  // Recalculate total marks
  this.configuration.totalMarks = this.questions.reduce((total, q) => total + q.marks, 0);
  
  return this.save();
};

testSchema.methods.removeQuestion = function(questionId) {
  const questionIndex = this.questions.findIndex(
    q => q.questionId.toString() === questionId.toString()
  );
  
  if (questionIndex === -1) {
    throw new Error('Question not found in this test');
  }
  
  this.questions.splice(questionIndex, 1);
  this.configuration.totalQuestions = this.questions.length;
  this.configuration.totalMarks = this.questions.reduce((total, q) => total + q.marks, 0);
  
  return this.save();
};

testSchema.methods.publish = function() {
  if (this.questions.length === 0) {
    throw new Error('Cannot publish test without questions');
  }
  
  if (this.schedule.startDate <= new Date()) {
    throw new Error('Cannot publish test with a past or current start date');
  }
  
  this.status = 'published';
  return this.save();
};

testSchema.methods.activate = function() {
  if (this.status !== 'published') {
    throw new Error('Test must be published before activation');
  }
  
  this.status = 'active';
  return this.save();
};

// --- STATIC METHODS ---
testSchema.statics.findByTestCode = function(testCode) {
  return this.findOne({ testCode: testCode.toUpperCase() });
};

testSchema.statics.findByCourse = function(courseId) {
  return this.find({ courseId, status: { $in: ['published', 'active', 'completed'] } });
};

testSchema.statics.findActiveTests = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    'schedule.startDate': { $lte: now },
    'schedule.endDate': { $gte: now }
  });
};

testSchema.statics.findUpcomingTests = function(limit = 10) {
  const now = new Date();
  return this.find({
    status: 'published',
    'schedule.startDate': { $gt: now }
  }).sort({ 'schedule.startDate': 1 }).limit(limit);
};

// --- MIDDLEWARE (HOOKS) ---
testSchema.pre('save', function(next) {
  // Auto-generate test code if not provided on a new document
  if (this.isNew && !this.testCode) {
    this.testCode = `TEST-${Date.now()}`;
  }
  
  // Validate schedule dates
  if (this.schedule.endDate <= this.schedule.startDate) {
    return next(new Error('End date must be after the start date'));
  }
  
  // Validate passing marks against total marks
  if (this.configuration.passingMarks > this.configuration.totalMarks) {
    return next(new Error('Passing marks cannot exceed total marks'));
  }
  
  next();
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;

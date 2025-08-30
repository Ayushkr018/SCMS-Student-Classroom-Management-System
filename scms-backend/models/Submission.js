/**
 * Submission Model
 * Handles student assignment submissions with file management
 */

const mongoose = require('mongoose');
const { SUBMISSION_STATUS } = require('../utils/constants');

const submissionSchema = new mongoose.Schema({
  // Assignment and Student Reference
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: [true, 'Assignment ID is required']
  },
  
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  
  // Submission Content
  submissionType: {
    type: String,
    enum: ['file_upload', 'text_submission', 'url_submission', 'mixed'],
    required: [true, 'Submission type is required']
  },
  
  textContent: {
    type: String,
    maxlength: [10000, 'Text content cannot exceed 10000 characters']
  },
  
  urlSubmission: {
    type: String,
    validate: {
      validator: function(url) {
        return !url || /^https?:\/\/.+/.test(url);
      },
      message: 'Please provide a valid URL'
    }
  },
  
  // File Management
  files: [{
    originalName: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Submission Status and Timing
  status: {
    type: String,
    enum: Object.values(SUBMISSION_STATUS),
    default: 'not_started'
  },
  
  submittedAt: {
    type: Date
  },
  
  isLate: {
    type: Boolean,
    default: false
  },
  
  daysLate: {
    type: Number,
    default: 0,
    min: [0, 'Days late cannot be negative']
  },
  
  latePenalty: {
    type: Number,
    default: 0,
    min: [0, 'Late penalty cannot be negative'],
    max: [100, 'Late penalty cannot exceed 100%']
  },
  
  // Attempts and Revisions
  attemptNumber: {
    type: Number,
    default: 1,
    min: [1, 'Attempt number must be at least 1']
  },
  
  previousSubmissions: [{
    submittedAt: Date,
    files: [String],
    textContent: String,
    grade: Number,
    feedback: String
  }],
  
  // Grading Information
  grading: {
    status: {
      type: String,
      enum: ['not_graded', 'grading', 'graded', 'returned'],
      default: 'not_graded'
    },
    
    score: {
      type: Number,
      min: [0, 'Score cannot be negative']
    },
    
    maxScore: {
      type: Number,
      min: [1, 'Max score must be at least 1']
    },
    
    percentage: {
      type: Number,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    },
    
    letterGrade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']
    },
    
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    
    gradedAt: Date,
    
    autoGraded: {
      type: Boolean,
      default: false
    }
  },
  
  // Feedback and Comments
  feedback: {
    teacherComments: {
      type: String,
      maxlength: [2000, 'Teacher comments cannot exceed 2000 characters']
    },
    
    rubricScores: [{
      criteria: String,
      score: Number,
      maxScore: Number,
      comments: String
    }],
    
    suggestions: [String],
    
    privateNotes: {
      type: String,
      maxlength: [1000, 'Private notes cannot exceed 1000 characters']
    }
  },
  
  // Plagiarism Check
  plagiarismCheck: {
    checked: {
      type: Boolean,
      default: false
    },
    
    checkedAt: Date,
    
    similarityScore: {
      type: Number,
      min: [0, 'Similarity score cannot be negative'],
      max: [100, 'Similarity score cannot exceed 100']
    },
    
    sources: [{
      source: String,
      similarity: Number,
      url: String
    }],
    
    flagged: {
      type: Boolean,
      default: false
    }
  },
  
  // Metadata
  submissionMetadata: {
    ipAddress: String,
    userAgent: String,
    location: {
      lat: Number,
      lng: Number
    },
    deviceInfo: String,
    browserInfo: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ status: 1 });
submissionSchema.index({ submittedAt: -1 });
submissionSchema.index({ 'grading.status': 1 });

// Virtual properties
submissionSchema.virtual('finalScore').get(function() {
  if (this.grading.score && this.latePenalty > 0) {
    const penaltyAmount = (this.grading.score * this.latePenalty) / 100;
    return Math.max(0, this.grading.score - penaltyAmount);
  }
  return this.grading.score || 0;
});

submissionSchema.virtual('isSubmitted').get(function() {
  return ['submitted', 'graded', 'returned'].includes(this.status);
});

submissionSchema.virtual('isGraded').get(function() {
  return this.grading.status === 'graded';
});

submissionSchema.virtual('totalFileSize').get(function() {
  return this.files.reduce((total, file) => total + file.fileSize, 0);
});

// Instance methods
submissionSchema.methods.submit = async function(submissionData = {}) {
  this.status = 'submitted';
  this.submittedAt = new Date();
  
  // Check if late
  const Assignment = require('./Assignment');
  const assignment = await Assignment.findById(this.assignmentId);
  
  if (this.submittedAt > assignment.dueDate) {
    this.isLate = true;
    this.daysLate = Math.ceil((this.submittedAt - assignment.dueDate) / (1000 * 60 * 60 * 24));
    this.latePenalty = assignment.calculateLatePenalty(this.submittedAt);
  }
  
  // Update content
  if (submissionData.textContent) this.textContent = submissionData.textContent;
  if (submissionData.urlSubmission) this.urlSubmission = submissionData.urlSubmission;
  if (submissionData.files) this.files = submissionData.files;
  
  return this.save();
};

submissionSchema.methods.grade = async function(gradeData) {
  this.grading.score = gradeData.score;
  this.grading.maxScore = gradeData.maxScore;
  this.grading.percentage = Math.round((gradeData.score / gradeData.maxScore) * 100);
  this.grading.letterGrade = this.calculateLetterGrade(this.grading.percentage);
  this.grading.gradedBy = gradeData.gradedBy;
  this.grading.gradedAt = new Date();
  this.grading.status = 'graded';
  
  if (gradeData.feedback) {
    this.feedback.teacherComments = gradeData.feedback;
  }
  
  if (gradeData.rubricScores) {
    this.feedback.rubricScores = gradeData.rubricScores;
  }
  
  return this.save();
};

submissionSchema.methods.calculateLetterGrade = function(percentage) {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 60) return 'D';
  return 'F';
};

submissionSchema.methods.checkPlagiarism = async function() {
  // Implement plagiarism checking logic here
  // This would integrate with plagiarism detection services
  this.plagiarismCheck.checked = true;
  this.plagiarismCheck.checkedAt = new Date();
  
  // Mock implementation - in real scenario, integrate with Turnitin or similar
  const mockSimilarityScore = Math.random() * 30; // 0-30% similarity
  this.plagiarismCheck.similarityScore = mockSimilarityScore;
  this.plagiarismCheck.flagged = mockSimilarityScore > 20;
  
  return this.save();
};

// Static methods
submissionSchema.statics.findByAssignment = function(assignmentId) {
  return this.find({ assignmentId })
    .populate('studentId', 'rollNumber firstName lastName')
    .sort({ submittedAt: -1 });
};

submissionSchema.statics.findPendingGrading = function() {
  return this.find({ 
    status: 'submitted',
    'grading.status': 'not_graded'
  }).populate('assignmentId studentId');
};

submissionSchema.statics.findLateSubmissions = function() {
  return this.find({ isLate: true })
    .populate('assignmentId studentId')
    .sort({ daysLate: -1 });
};

// Pre-save middleware
submissionSchema.pre('save', function(next) {
  // Update grading status based on submission status
  if (this.status === 'submitted' && this.grading.status === 'not_graded') {
    this.grading.status = 'not_graded';
  }
  
  next();
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;

/**
 * Assignment Model
 * Handles assignments, homework, and project management
 */

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  assignmentCode: {
    type: String,
    unique: true,
    uppercase: true,
    required: [true, 'Assignment code is required']
  },
  
  // Course and Instructor
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Instructor ID is required']
  },
  
  // Assignment Configuration
  type: {
    type: String,
    enum: ['homework', 'project', 'lab', 'essay', 'presentation', 'group_work'],
    required: [true, 'Assignment type is required']
  },
  
  maxMarks: {
    type: Number,
    required: [true, 'Maximum marks is required'],
    min: [1, 'Maximum marks must be at least 1']
  },
  
  weightage: {
    type: Number,
    required: [true, 'Weightage percentage is required'],
    min: [0, 'Weightage cannot be negative'],
    max: [100, 'Weightage cannot exceed 100%']
  },
  
  // Timing
  assignedDate: {
    type: Date,
    required: [true, 'Assigned date is required'],
    default: Date.now
  },
  
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  
  lateSubmissionAllowed: {
    type: Boolean,
    default: true
  },
  
  latePenalty: {
    type: Number,
    default: 10, // 10% penalty per day
    min: [0, 'Late penalty cannot be negative'],
    max: [100, 'Late penalty cannot exceed 100%']
  },
  
  maxLateDays: {
    type: Number,
    default: 3,
    min: [0, 'Max late days cannot be negative']
  },
  
  // Submission Requirements
  submissionFormat: {
    type: String,
    enum: ['file_upload', 'text_submission', 'url_submission', 'mixed'],
    default: 'file_upload'
  },
  
  allowedFileTypes: [{
    type: String,
    enum: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png', 'zip', 'rar', 'ppt', 'pptx']
  }],
  
  maxFileSize: {
    type: Number,
    default: 10, // MB
    min: [1, 'Max file size must be at least 1MB']
  },
  
  maxFiles: {
    type: Number,
    default: 5,
    min: [1, 'Must allow at least 1 file']
  },
  
  // Instructions and Resources
  instructions: [String],
  
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'video', 'document']
    },
    url: String,
    description: String
  }],
  
  // Rubric and Grading
  rubric: [{
    criteria: {
      type: String,
      required: true
    },
    description: String,
    maxPoints: {
      type: Number,
      required: true,
      min: [1, 'Max points must be at least 1']
    }
  }],
  
  autoGrading: {
    enabled: {
      type: Boolean,
      default: false
    },
    testCases: [{
      input: String,
      expectedOutput: String,
      points: Number
    }]
  },
  
  // Visibility and Access
  status: {
    type: String,
    enum: ['draft', 'published', 'closed', 'graded'],
    default: 'draft'
  },
  
  visibility: {
    type: String,
    enum: ['all', 'specific_students', 'groups'],
    default: 'all'
  },
  
  targetStudents: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  }],
  
  // Group Assignment Settings
  isGroupAssignment: {
    type: Boolean,
    default: false
  },
  
  groupSettings: {
    minMembers: {
      type: Number,
      default: 2,
      min: [1, 'Minimum members must be at least 1']
    },
    maxMembers: {
      type: Number,
      default: 4,
      min: [1, 'Maximum members must be at least 1']
    },
    allowSelfSelection: {
      type: Boolean,
      default: true
    }
  },
  
  // Statistics
  statistics: {
    totalSubmissions: {
      type: Number,
      default: 0
    },
    onTimeSubmissions: {
      type: Number,
      default: 0
    },
    lateSubmissions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    gradedSubmissions: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
assignmentSchema.index({ assignmentCode: 1 });
assignmentSchema.index({ courseId: 1, status: 1 });
assignmentSchema.index({ instructorId: 1 });
assignmentSchema.index({ dueDate: 1 });

// Virtual properties
assignmentSchema.virtual('isOverdue').get(function() {
  return new Date() > this.dueDate;
});

assignmentSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

assignmentSchema.virtual('submissionRate').get(function() {
  // This would need to be calculated based on enrolled students
  return 0; // Placeholder
});

// Instance methods
assignmentSchema.methods.canSubmit = function() {
  const now = new Date();
  
  if (this.status !== 'published') {
    return { canSubmit: false, reason: 'Assignment is not published' };
  }
  
  if (!this.lateSubmissionAllowed && now > this.dueDate) {
    return { canSubmit: false, reason: 'Assignment deadline has passed' };
  }
  
  if (this.lateSubmissionAllowed && now > this.dueDate) {
    const daysLate = Math.ceil((now - this.dueDate) / (1000 * 60 * 60 * 24));
    if (daysLate > this.maxLateDays) {
      return { canSubmit: false, reason: 'Late submission period has ended' };
    }
    return { canSubmit: true, isLate: true, daysLate };
  }
  
  return { canSubmit: true, isLate: false };
};

assignmentSchema.methods.calculateLatePenalty = function(submissionDate) {
  if (submissionDate <= this.dueDate) return 0;
  
  const daysLate = Math.ceil((submissionDate - this.dueDate) / (1000 * 60 * 60 * 24));
  return Math.min(daysLate * this.latePenalty, 100); // Max 100% penalty
};

// Static methods
assignmentSchema.statics.findByAssignmentCode = function(code) {
  return this.findOne({ assignmentCode: code.toUpperCase() });
};

assignmentSchema.statics.findByCourse = function(courseId) {
  return this.find({ courseId, status: { $in: ['published'] } });
};

assignmentSchema.statics.findUpcoming = function(limit = 5) {
  return this.find({
    status: 'published',
    dueDate: { $gte: new Date() }
  }).sort({ dueDate: 1 }).limit(limit);
};

// Pre-save middleware
assignmentSchema.pre('save', function(next) {
  if (this.isNew && !this.assignmentCode) {
    this.assignmentCode = `ASN${Date.now()}`;
  }
  
  if (this.dueDate <= this.assignedDate) {
    return next(new Error('Due date must be after assigned date'));
  }
  
  next();
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;

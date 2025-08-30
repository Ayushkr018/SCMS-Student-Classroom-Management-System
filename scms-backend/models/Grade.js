/**
 * Grade Model
 * Comprehensive grading system with analytics
 */

const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  // Student and Course Information
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  
  // Assessment Information
  assessmentType: {
    type: String,
    enum: ['assignment', 'test', 'quiz', 'project', 'midterm', 'final', 'participation'],
    required: [true, 'Assessment type is required']
  },
  
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Assessment ID is required']
  },
  
  // Grade Details
  scoreObtained: {
    type: Number,
    required: [true, 'Score obtained is required'],
    min: [0, 'Score cannot be negative']
  },
  
  maxScore: {
    type: Number,
    required: [true, 'Maximum score is required'],
    min: [1, 'Maximum score must be at least 1']
  },
  
  percentage: {
    type: Number,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  
  letterGrade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'I', 'W']
  },
  
  gradePoints: {
    type: Number,
    min: [0, 'Grade points cannot be negative'],
    max: [10, 'Grade points cannot exceed 10']
  },
  
  // Weightage and Credits
  weightage: {
    type: Number,
    required: [true, 'Weightage is required'],
    min: [0, 'Weightage cannot be negative'],
    max: [100, 'Weightage cannot exceed 100%']
  },
  
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [0, 'Credits cannot be negative']
  },
  
  // Grading Information
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Grader ID is required']
  },
  
  gradedAt: {
    type: Date,
    required: [true, 'Grading date is required'],
    default: Date.now
  },
  
  isReleased: {
    type: Boolean,
    default: false
  },
  
  releasedAt: Date,
  
  // Academic Period
  semester: {
    type: String,
    required: [true, 'Semester is required']
  },
  
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    match: [/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY']
  },
  
  // Comments and Feedback
  comments: {
    type: String,
    maxlength: [1000, 'Comments cannot exceed 1000 characters']
  },
  
  feedback: {
    strengths: [String],
    improvements: [String],
    suggestions: [String]
  },
  
  // Additional Information
  extraCredit: {
    type: Number,
    default: 0,
    min: [0, 'Extra credit cannot be negative']
  },
  
  penalty: {
    type: Number,
    default: 0,
    min: [0, 'Penalty cannot be negative']
  },
  
  penaltyReason: String,
  
  // Grade History
  gradeHistory: [{
    previousScore: Number,
    previousPercentage: Number,
    previousLetterGrade: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    changedAt: Date,
    reason: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
gradeSchema.index({ studentId: 1, courseId: 1 });
gradeSchema.index({ courseId: 1, assessmentType: 1 });
gradeSchema.index({ semester: 1, academicYear: 1 });
gradeSchema.index({ isReleased: 1, releasedAt: -1 });

// Virtual properties
gradeSchema.virtual('finalScore').get(function() {
  return this.scoreObtained + this.extraCredit - this.penalty;
});

gradeSchema.virtual('adjustedPercentage').get(function() {
  const finalScore = this.finalScore;
  return Math.min(100, Math.max(0, (finalScore / this.maxScore) * 100));
});

gradeSchema.virtual('isPassing').get(function() {
  return this.percentage >= 40; // Assuming 40% is passing
});

// Instance methods
gradeSchema.methods.calculateGradePoints = function() {
  const percentage = this.adjustedPercentage;
  
  if (percentage >= 90) return 10;
  if (percentage >= 80) return 9;
  if (percentage >= 70) return 8;
  if (percentage >= 60) return 7;
  if (percentage >= 50) return 6;
  if (percentage >= 40) return 5;
  return 0;
};

gradeSchema.methods.calculateLetterGrade = function() {
  const percentage = this.adjustedPercentage;
  
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

gradeSchema.methods.updateGrade = function(newScore, reason, updatedBy) {
  // Store previous grade in history
  this.gradeHistory.push({
    previousScore: this.scoreObtained,
    previousPercentage: this.percentage,
    previousLetterGrade: this.letterGrade,
    changedBy: updatedBy,
    changedAt: new Date(),
    reason
  });
  
  // Update current grade
  this.scoreObtained = newScore;
  this.percentage = this.adjustedPercentage;
  this.letterGrade = this.calculateLetterGrade();
  this.gradePoints = this.calculateGradePoints();
  
  return this.save();
};

gradeSchema.methods.release = function() {
  this.isReleased = true;
  this.releasedAt = new Date();
  return this.save();
};

// Static methods
gradeSchema.statics.findByCourse = function(courseId, options = {}) {
  const query = { courseId };
  if (options.semester) query.semester = options.semester;
  if (options.academicYear) query.academicYear = options.academicYear;
  
  return this.find(query).populate('studentId', 'rollNumber firstName lastName');
};

gradeSchema.statics.findByStudent = function(studentId, options = {}) {
  const query = { studentId };
  if (options.courseId) query.courseId = options.courseId;
  if (options.semester) query.semester = options.semester;
  if (options.academicYear) query.academicYear = options.academicYear;
  
  return this.find(query).populate('courseId', 'title courseCode');
};

gradeSchema.statics.calculateCGPA = async function(studentId, semesterLimit = null) {
  const pipeline = [
    { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: null,
        totalCredits: { $sum: '$credits' },
        totalGradePoints: { $sum: { $multiply: ['$gradePoints', '$credits'] } }
      }
    }
  ];
  
  if (semesterLimit) {
    pipeline[0].$match.semester = { $in: semesterLimit };
  }
  
  const result = await this.aggregate(pipeline);
  
  if (result.length === 0 || result[0].totalCredits === 0) {
    return 0;
  }
  
  return (result[0].totalGradePoints / result[0].totalCredits).toFixed(2);
};

gradeSchema.statics.getCourseStatistics = async function(courseId, semester, academicYear) {
  return await this.aggregate([
    {
      $match: {
        courseId: mongoose.Types.ObjectId(courseId),
        semester,
        academicYear,
        isReleased: true
      }
    },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
        averageScore: { $avg: '$scoreObtained' },
        averagePercentage: { $avg: '$percentage' },
        highestScore: { $max: '$scoreObtained' },
        lowestScore: { $min: '$scoreObtained' },
        passCount: {
          $sum: { $cond: [{ $gte: ['$percentage', 40] }, 1, 0] }
        }
      }
    }
  ]);
};

// Pre-save middleware
gradeSchema.pre('save', function(next) {
  // Auto-calculate percentage
  this.percentage = (this.scoreObtained / this.maxScore) * 100;
  
  // Auto-calculate letter grade and grade points
  this.letterGrade = this.calculateLetterGrade();
  this.gradePoints = this.calculateGradePoints();
  
  next();
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;

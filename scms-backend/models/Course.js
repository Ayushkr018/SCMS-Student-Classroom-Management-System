/**
 * Course Model
 * Comprehensive course management with prerequisites and scheduling
 */

const mongoose = require('mongoose');
// const { SEMESTERS } = require('../utils/constants'); // Assuming this will be created

const courseSchema = new mongoose.Schema({
  // Basic Course Information
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{2,4}\d{3,4}$/, 'Course code must be in format like CS101 or MATH2001']
  },
  
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Academic Details
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: [
      'Computer Science',
      'Information Technology',
      'Electronics',
      'Mechanical',
      'Civil',
      'Chemical',
      'Electrical',
      'Biotechnology',
      'Mathematics',
      'Physics',
      'Chemistry',
      'English',
      'Management'
    ]
  },
  
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['undergraduate', 'postgraduate', 'diploma', 'certificate']
  },
  
  credits: {
    total: {
      type: Number,
      required: [true, 'Total credits are required'],
      min: [1, 'Credits must be at least 1'],
      max: [10, 'Credits cannot exceed 10']
    },
    theory: { type: Number, default: 0, min: [0, 'Theory credits cannot be negative'] },
    practical: { type: Number, default: 0, min: [0, 'Practical credits cannot be negative'] },
    tutorial: { type: Number, default: 0, min: [0, 'Tutorial credits cannot be negative'] }
  },
  
  duration: {
    hours: { type: Number, required: [true, 'Course duration in hours is required'], min: [1, 'Duration must be at least 1 hour'] },
    weeks: { type: Number, required: [true, 'Course duration in weeks is required'], min: [1, 'Duration must be at least 1 week'] }
  },
  
  // Prerequisites and Requirements
  prerequisites: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseCode: String,
    minGrade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D'],
      default: 'C'
    }
  }],
  
  corequisites: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseCode: String
  }],
  
  recommendedPrerequisites: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseCode: String,
    reason: String
  }],
  
  // Course Structure
  syllabus: {
    units: [{
      unitNumber: { type: Number, required: true },
      title: { type: String, required: true },
      topics: [String],
      learningOutcomes: [String],
      duration: Number, // in hours
      weightage: Number // percentage in final evaluation
    }],
    
    learningObjectives: [String],
    courseOutcomes: [String],
    
    textbooks: [{
      title: String,
      author: String,
      edition: String,
      publisher: String,
      year: Number,
      isbn: String,
      type: {
        type: String,
        enum: ['primary', 'secondary', 'reference'],
        default: 'primary'
      }
    }],
    
    references: [{
      title: String,
      author: String,
      type: {
        type: String,
        enum: ['book', 'journal', 'website', 'video', 'other'],
        default: 'book'
      },
      url: String
    }]
  },
  
  // Assessment Structure
  evaluation: {
    components: [{
      type: {
        type: String,
        enum: ['quiz', 'assignment', 'project', 'mid_exam', 'final_exam', 'presentation', 'lab', 'viva'],
        required: true
      },
      weightage: {
        type: Number,
        required: true,
        min: [0, 'Weightage cannot be negative'],
        max: [100, 'Weightage cannot exceed 100%']
      },
      description: String,
      count: {
        type: Number,
        default: 1,
        min: [1, 'Count must be at least 1']
      }
    }],
    
    gradingScheme: {
      type: String,
      enum: ['absolute', 'relative', 'pass_fail'],
      default: 'absolute'
    },
    
    passPercentage: {
      type: Number,
      default: 40,
      min: [0, 'Pass percentage cannot be negative'],
      max: [100, 'Pass percentage cannot exceed 100']
    }
  },
  
  // Scheduling Information
  schedule: {
    semester: {
      type: String,
      // enum: Object.values(SEMESTERS), // Assuming SEMESTERS constant exists
      required: [true, 'Semester is required']
    },
    
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      match: [/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY']
    },
    
    timeSlots: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
      },
      startTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
      },
      endTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
      },
      room: String,
      building: String,
      type: {
        type: String,
        enum: ['theory', 'practical', 'tutorial'],
        default: 'theory'
      }
    }],
    
    examSchedule: {
      midTerm: { date: Date, time: String, duration: Number, room: String },
      finalExam: { date: Date, time: String, duration: Number, room: String }
    }
  },
  
  // Instructor Information
  instructors: [{
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    role: { type: String, enum: ['primary', 'co_instructor', 'lab_instructor', 'guest'], default: 'primary' },
    assignedUnits: [Number], // which units this instructor teaches
    responsibilityPercentage: { type: Number, min: 0, max: 100 }
  }],
  
  // Enrollment Information
  enrollment: {
    maxStudents: { type: Number, required: [true, 'Maximum students limit is required'], min: [1, 'At least 1 student must be allowed'] },
    minStudents: { type: Number, default: 5, min: [1, 'Minimum students must be at least 1'] },
    currentEnrollment: { type: Number, default: 0, min: [0, 'Current enrollment cannot be negative'] },
    waitlistLimit: { type: Number, default: 10, min: [0, 'Waitlist limit cannot be negative'] },
    registrationStart: { type: Date, required: [true, 'Registration start date is required'] },
    registrationEnd: { type: Date, required: [true, 'Registration end date is required'] },
    dropDeadline: { type: Date, required: [true, 'Drop deadline is required'] }
  },
  
  // Course Status and Metadata
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'completed', 'cancelled', 'archived'],
    default: 'draft'
  },
  
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  
  tags: [{ type: String, trim: true, lowercase: true }],
  
  // Resources and Materials
  resources: [{
    title: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'video', 'link', 'document', 'presentation', 'other'], required: true },
    url: String,
    description: String,
    uploadDate: { type: Date, default: Date.now },
    size: Number, // in bytes
    isRequired: { type: Boolean, default: false }
  }],
  
  // Additional Information
  fees: {
    amount: { type: Number, default: 0, min: [0, 'Fee amount cannot be negative'] },
    currency: { type: String, default: 'INR' },
    type: { type: String, enum: ['free', 'paid', 'scholarship_available'], default: 'free' }
  },
  
  language: { type: String, default: 'English' },
  
  certificateAvailable: { type: Boolean, default: true },
  
  // Analytics
  statistics: {
    totalEnrollments: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0, min: 0, max: 100 },
    averageGrade: String,
    passRate: { type: Number, default: 0, min: 0, max: 100 },
    studentFeedback: {
      averageRating: { type: Number, min: 1, max: 5 },
      totalResponses: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ courseCode: 1 });
courseSchema.index({ department: 1, level: 1 });
courseSchema.index({ status: 1, visibility: 1 });
courseSchema.index({ 'schedule.semester': 1, 'schedule.academicYear': 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ 'enrollment.registrationStart': 1, 'enrollment.registrationEnd': 1 });

// Virtual properties
courseSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  return now >= this.enrollment.registrationStart && now <= this.enrollment.registrationEnd;
});

courseSchema.virtual('availableSeats').get(function() {
  return this.enrollment.maxStudents - this.enrollment.currentEnrollment;
});

courseSchema.virtual('isFullyEnrolled').get(function() {
  return this.enrollment.currentEnrollment >= this.enrollment.maxStudents;
});

courseSchema.virtual('totalWeightage').get(function() {
  return this.evaluation.components.reduce((total, component) => total + component.weightage, 0);
});

courseSchema.virtual('primaryInstructor').get(function() {
  return this.instructors.find(instructor => instructor.role === 'primary');
});

// Instance methods
courseSchema.methods.canEnroll = function(studentId) {
  if (this.status !== 'active') return { canEnroll: false, reason: 'Course is not active' };
  if (!this.isRegistrationOpen) return { canEnroll: false, reason: 'Registration is closed' };
  if (this.isFullyEnrolled) return { canEnroll: false, reason: 'Course is full' };
  
  return { canEnroll: true };
};

courseSchema.methods.addStudent = function() {
  if (this.enrollment.currentEnrollment < this.enrollment.maxStudents) {
    this.enrollment.currentEnrollment += 1;
    return this.save();
  }
  throw new Error('Course is full');
};

courseSchema.methods.removeStudent = function() {
  if (this.enrollment.currentEnrollment > 0) {
    this.enrollment.currentEnrollment -= 1;
    return this.save();
  }
  throw new Error('No students to remove');
};

courseSchema.methods.addInstructor = function(teacherId, role = 'co_instructor') {
  const existingInstructor = this.instructors.find(
    instructor => instructor.teacherId.toString() === teacherId.toString()
  );
  
  if (existingInstructor) {
    throw new Error('Instructor already assigned to this course');
  }
  
  this.instructors.push({ teacherId, role });
  return this.save();
};

courseSchema.methods.updateSchedule = function(schedule) {
  this.schedule = { ...this.schedule, ...schedule };
  return this.save();
};

// Static methods
courseSchema.statics.findByCourseCode = function(courseCode) {
  return this.findOne({ courseCode: courseCode.toUpperCase() });
};

courseSchema.statics.findByDepartment = function(department) {
  return this.find({ department, status: { $in: ['published', 'active'] } });
};

courseSchema.statics.findBySemester = function(semester, academicYear) {
  return this.find({
    'schedule.semester': semester,
    'schedule.academicYear': academicYear,
    status: { $in: ['published', 'active'] }
  });
};

courseSchema.statics.findAvailableCourses = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    'enrollment.registrationStart': { $lte: now },
    'enrollment.registrationEnd': { $gte: now },
    $expr: { $lt: ['$enrollment.currentEnrollment', '$enrollment.maxStudents'] }
  });
};

// Pre-save middleware
courseSchema.pre('save', function(next) {
  // Validate that total weightage equals 100%
  if (this.isModified('evaluation.components')) {
    const totalWeightage = this.evaluation.components.reduce(
      (total, component) => total + component.weightage, 0
    );
    
    if (totalWeightage !== 100 && this.evaluation.components.length > 0) {
      return next(new Error('Total evaluation weightage must equal 100%'));
    }
  }
  
  // Ensure registration end is after start
  if (this.isModified('enrollment.registrationEnd') || this.isModified('enrollment.registrationStart')) {
    if (this.enrollment.registrationEnd <= this.enrollment.registrationStart) {
        return next(new Error('Registration end date must be after start date'));
    }
  }
  
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

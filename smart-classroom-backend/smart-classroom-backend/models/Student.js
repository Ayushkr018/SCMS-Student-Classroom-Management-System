/**
 * Student Model
 * Extended student-specific information and academic tracking
 */

const mongoose = require('mongoose');
const { SEMESTERS } = require('../utils/constants');

const studentSchema = new mongoose.Schema({
  // Reference to base User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Academic Information
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z0-9]+$/, 'Roll number must contain only letters and numbers']
  },
  
  admissionNumber: {
    type: String,
    required: [true, 'Admission number is required'],
    unique: true
  },
  
  admissionDate: {
    type: Date,
    required: [true, 'Admission date is required'],
    validate: {
      validator: function(value) {
        return value <= Date.now();
      },
      message: 'Admission date cannot be in the future'
    }
  },
  
  currentSemester: {
    type: Number,
    required: [true, 'Current semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [12, 'Semester cannot exceed 12']
  },
  
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true,
    enum: [
      'Computer Science',
      'Information Technology', 
      'Electronics',
      'Mechanical',
      'Civil',
      'Chemical',
      'Electrical',
      'Biotechnology'
    ]
  },
  
  program: {
    type: String,
    required: [true, 'Program is required'],
    enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate']
  },
  
  batch: {
    type: String,
    required: [true, 'Batch year is required'],
    match: [/^\d{4}-\d{4}$/, 'Batch must be in format YYYY-YYYY (e.g., 2021-2025)']
  },
  
  // Academic Performance
  cgpa: {
    type: Number,
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot exceed 10'],
    default: 0
  },
  
  totalCredits: {
    type: Number,
    default: 0,
    min: [0, 'Credits cannot be negative']
  },
  
  completedCredits: {
    type: Number,
    default: 0,
    min: [0, 'Completed credits cannot be negative']
  },
  
  // Personal Information
  parentDetails: {
    father: {
      name: {
        type: String,
        required: [true, "Father's name is required"],
        trim: true
      },
      occupation: String,
      phone: {
        type: String,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
      },
      email: {
        type: String,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
      }
    },
    mother: {
      name: {
        type: String,
        required: [true, "Mother's name is required"],
        trim: true
      },
      occupation: String,
      phone: {
        type: String,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
      },
      email: {
        type: String,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
      }
    },
    guardian: {
      name: String,
      relation: String,
      phone: String,
      email: String
    }
  },
  
  address: {
    permanent: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: 'India' },
      pincode: { 
        type: String, 
        required: true,
        match: [/^\d{6}$/, 'Pincode must be 6 digits']
      }
    },
    current: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
      sameAsPermanent: { type: Boolean, default: true }
    }
  },
  
  // Enrollment Information
  enrolledCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped', 'failed'],
      default: 'active'
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'I', 'W'],
      default: null
    }
  }],
  
  // Academic Status
  academicStatus: {
    type: String,
    enum: ['active', 'on_probation', 'suspended', 'expelled', 'graduated', 'dropped_out'],
    default: 'active'
  },
  
  financialStatus: {
    type: String,
    enum: ['clear', 'pending', 'overdue'],
    default: 'clear'
  },
  
  // Additional Information
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relation: {
      type: String,
      required: [true, 'Emergency contact relation is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
    }
  },
  
  medicalInfo: {
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    allergies: [String],
    medications: [String],
    medicalConditions: [String]
  },
  
  // Library Information
  libraryCardNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Hostel Information
  hostelInfo: {
    isHostelResident: {
      type: Boolean,
      default: false
    },
    hostelName: String,
    roomNumber: String,
    roomType: {
      type: String,
      enum: ['single', 'double', 'triple', 'shared']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
studentSchema.index({ userId: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ batch: 1, branch: 1 });
studentSchema.index({ currentSemester: 1 });
studentSchema.index({ academicStatus: 1 });

// Virtual properties
studentSchema.virtual('fullRollNumber').get(function() {
  return `${this.batch.split('-')[0]}${this.branch.replace(/\s+/g, '').substring(0,3).toUpperCase()}${this.rollNumber}`;
});

studentSchema.virtual('academicProgress').get(function() {
  if (this.totalCredits === 0) return 0;
  return Math.round((this.completedCredits / this.totalCredits) * 100);
});

studentSchema.virtual('isEligibleForNextSemester').get(function() {
  return this.cgpa >= 5.0 && this.academicStatus === 'active';
});

// Instance methods
studentSchema.methods.updateCGPA = async function(newGrades) {
  // Calculate CGPA based on new grades
  // Implementation depends on your grading system
  console.log('Updating CGPA for student:', this.rollNumber);
};

studentSchema.methods.enrollInCourse = function(courseId) {
  const existingEnrollment = this.enrolledCourses.find(
    enrollment => enrollment.courseId.toString() === courseId.toString()
  );
  
  if (existingEnrollment) {
    throw new Error('Already enrolled in this course');
  }
  
  this.enrolledCourses.push({
    courseId,
    enrollmentDate: new Date(),
    status: 'active'
  });
  
  return this.save();
};

studentSchema.methods.dropCourse = function(courseId) {
  const enrollment = this.enrolledCourses.find(
    enrollment => enrollment.courseId.toString() === courseId.toString()
  );
  
  if (!enrollment) {
    throw new Error('Not enrolled in this course');
  }
  
  enrollment.status = 'dropped';
  return this.save();
};

// Static methods
studentSchema.statics.findByRollNumber = function(rollNumber) {
  return this.findOne({ rollNumber: rollNumber.toUpperCase() });
};

studentSchema.statics.findByBatch = function(batch) {
  return this.find({ batch });
};

studentSchema.statics.findBySemester = function(semester) {
  return this.find({ currentSemester: semester });
};

// Pre-save middleware
studentSchema.pre('save', function(next) {
  if (this.isNew && !this.libraryCardNumber) {
    this.libraryCardNumber = `LIB${this.rollNumber}${Date.now()}`;
  }
  next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

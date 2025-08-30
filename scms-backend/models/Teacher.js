/**
 * Teacher Model
 * Extended teacher-specific information and academic details
 */

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  // Reference to base User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Professional Information
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    uppercase: true
  },
  
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    enum: [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Lecturer',
      'Senior Lecturer',
      'Visiting Faculty',
      'Adjunct Professor'
    ]
  },
  
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
  
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
    validate: {
      validator: function(value) {
        return value <= Date.now();
      },
      message: 'Joining date cannot be in the future'
    }
  },
  
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: ['permanent', 'contractual', 'visiting', 'part_time']
  },
  
  salary: {
    basic: {
      type: Number,
      required: true,
      min: [0, 'Salary cannot be negative']
    },
    allowances: {
      type: Number,
      default: 0
    },
    deductions: {
      type: Number,
      default: 0
    }
  },
  
  // Educational Background
  qualifications: [{
    degree: {
      type: String,
      required: true,
      enum: ['PhD', 'Masters', 'Bachelors', 'Diploma', 'Certificate']
    },
    field: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    university: String,
    yearOfCompletion: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear()
    },
    grade: String,
    percentage: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  
  // Experience
  experience: {
    totalYears: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative']
    },
    industryYears: {
      type: Number,
      default: 0
    },
    teachingYears: {
      type: Number,
      default: 0
    },
    researchYears: {
      type: Number,
      default: 0
    }
  },
  
  previousExperience: [{
    organization: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    responsibilities: [String],
    reasonForLeaving: String
  }],
  
  // Academic Activities
  specializations: [{
    type: String,
    trim: true
  }],
  
  researchInterests: [{
    type: String,
    trim: true
  }],
  
  publications: [{
    title: {
      type: String,
      required: true
    },
    journal: String,
    conference: String,
    year: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear() + 1
    },
    authors: [String],
    doi: String,
    impactFactor: Number,
    citationCount: {
      type: Number,
      default: 0
    }
  }],
  
  projects: [{
    title: {
      type: String,
      required: true
    },
    fundingAgency: String,
    amount: Number,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'terminated'],
      default: 'ongoing'
    },
    role: {
      type: String,
      enum: ['Principal Investigator', 'Co-Investigator', 'Research Associate'],
      required: true
    }
  }],
  
  // Teaching Load
  teachingLoad: {
    maxHoursPerWeek: {
      type: Number,
      default: 18,
      min: [0, 'Teaching hours cannot be negative'],
      max: [40, 'Teaching hours cannot exceed 40 per week']
    },
    currentHours: {
      type: Number,
      default: 0
    }
  },
  
  // Courses Teaching
  assignedCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    semester: String,
    year: Number,
    role: {
      type: String,
      enum: ['instructor', 'co_instructor', 'lab_instructor'],
      default: 'instructor'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Administrative Responsibilities
  administrativeRoles: [{
    position: {
      type: String,
      required: true
    },
    department: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    responsibilities: [String]
  }],
  
  // Personal Information
  personalInfo: {
    panNumber: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please provide a valid PAN number']
    },
    aadharNumber: {
      type: String,
      match: [/^\d{12}$/, 'Aadhar number must be 12 digits']
    },
    bankDetails: {
      accountNumber: String,
      bankName: String,
      branchName: String,
      ifscCode: String
    },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String
    }
  },
  
  // Professional Development
  workshops: [{
    title: String,
    organizer: String,
    startDate: Date,
    endDate: Date,
    certificateUrl: String
  }],
  
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    certificateUrl: String
  }],
  
  // Performance Metrics
  performance: {
    studentRating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0
    },
    peerRating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0
    },
    lastEvaluationDate: Date,
    evaluationComments: [String]
  },
  
  // Status and Availability
  currentStatus: {
    type: String,
    enum: ['active', 'on_leave', 'sabbatical', 'resigned', 'retired'],
    default: 'active'
  },
  
  officeDetails: {
    roomNumber: String,
    building: String,
    floor: String,
    extensionNumber: String
  },
  
  officeHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
teacherSchema.index({ userId: 1 });
teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ department: 1 });
teacherSchema.index({ designation: 1 });
teacherSchema.index({ currentStatus: 1 });

// Virtual properties
teacherSchema.virtual('experienceYears').get(function() {
  if (this.joiningDate) {
    const years = (Date.now() - this.joiningDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(years);
  }
  return 0;
});

teacherSchema.virtual('netSalary').get(function() {
  return this.salary.basic + this.salary.allowances - this.salary.deductions;
});

teacherSchema.virtual('availableTeachingHours').get(function() {
  return this.teachingLoad.maxHoursPerWeek - this.teachingLoad.currentHours;
});

// Instance methods
teacherSchema.methods.assignCourse = function(courseId, role = 'instructor') {
  const existingAssignment = this.assignedCourses.find(
    assignment => assignment.courseId.toString() === courseId.toString()
  );
  
  if (existingAssignment) {
    throw new Error('Already assigned to this course');
  }
  
  this.assignedCourses.push({
    courseId,
    role,
    semester: 'Current',
    year: new Date().getFullYear()
  });
  
  return this.save();
};

teacherSchema.methods.updateTeachingLoad = function(hours) {
  if (hours < 0) {
    throw new Error('Teaching hours cannot be negative');
  }
  if (hours > this.teachingLoad.maxHoursPerWeek) {
    throw new Error('Teaching hours exceed maximum limit');
  }
  
  this.teachingLoad.currentHours = hours;
  return this.save();
};

teacherSchema.methods.addPublication = function(publicationData) {
  this.publications.push(publicationData);
  return this.save();
};

// Static methods
teacherSchema.statics.findByEmployeeId = function(employeeId) {
  return this.findOne({ employeeId: employeeId.toUpperCase() });
};

teacherSchema.statics.findByDepartment = function(department) {
  return this.find({ department });
};

teacherSchema.statics.findByDesignation = function(designation) {
  return this.find({ designation });
};

teacherSchema.statics.getAvailableTeachers = function(maxHours) {
  return this.find({
    currentStatus: 'active',
    $expr: {
      $lt: ['$teachingLoad.currentHours', '$teachingLoad.maxHoursPerWeek']
    }
  });
};

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;

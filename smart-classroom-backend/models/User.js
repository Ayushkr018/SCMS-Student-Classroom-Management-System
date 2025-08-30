/**
 * User Model
 * MongoDB schema for user management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES, USER_STATUS } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include in queries by default
  },
  
  // Profile Information
  profileImage: {
    type: String,
    default: null
  },
  
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
  },
  
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        return value < Date.now();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  
  // System Information
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.STUDENT,
    required: true
  },
  
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.ACTIVE
  },
  
  // Academic Information (for students and teachers)
  studentId: {
    type: String,
    sparse: true, // Allows multiple null values
    unique: true
  },
  
  employeeId: {
    type: String,
    sparse: true,
    unique: true
  },
  
  department: {
    type: String,
    trim: true
  },
  
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  
  // Authentication
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: {
    type: String,
    select: false
  },
  
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetExpires: {
    type: Date,
    select: false
  },
  
  passwordChangedAt: {
    type: Date,
    select: false
  },
  
  // Activity Tracking
  lastLogin: {
    type: Date
  },
  
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Settings and Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ studentId: 1 }, { sparse: true });
userSchema.index({ employeeId: 1 }, { sparse: true });
userSchema.index({ createdAt: -1 });

// Virtual properties
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('age').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function() {
  const verifyToken = require('crypto').randomBytes(32).toString('hex');
  
  this.emailVerificationToken = require('crypto')
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');
    
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verifyToken;
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.isActive = function() {
  return this.status === USER_STATUS.ACTIVE;
};

userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  this.lastActive = new Date();
  this.loginCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ status: USER_ROLES.ACTIVE });
};

userSchema.statics.findByRole = function(role) {
  return this.find({ role });
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();
  
  // Hash password
  this.password = await bcrypt.hash(this.password, 12);
  
  // Set passwordChangedAt
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure JWT is valid
  }
  
  next();
});

userSchema.pre('save', function(next) {
  // Generate student/employee ID if not provided
  if (this.isNew) {
    if (this.role === USER_ROLES.STUDENT && !this.studentId) {
      this.studentId = `STU${Date.now()}`;
    } else if (this.role === USER_ROLES.TEACHER && !this.employeeId) {
      this.employeeId = `EMP${Date.now()}`;
    }
  }
  next();
});

// Pre-remove middleware
userSchema.pre('remove', async function(next) {
  // Clean up related data when user is deleted
  // This would include removing user from courses, deleting submissions, etc.
  console.log(`Cleaning up data for user: ${this.email}`);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

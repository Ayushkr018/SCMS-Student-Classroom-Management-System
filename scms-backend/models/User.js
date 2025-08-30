/**
 * User Model
 * MongoDB schema for user management in the Smart Campus Management System.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Using crypto module consistently
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
    // A more robust regex for international phone numbers
    match: [/^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, 'Please provide a valid phone number']
  },
  
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        return value < new Date();
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
    sparse: true, // Allows multiple null values but enforces uniqueness on non-nulls
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
  
  // Authentication Tokens
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpires: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  passwordChangedAt: { type: Date, select: false },
  
  // Activity Tracking
  lastLogin: { type: Date },
  lastActive: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 0 },
  
  // Settings and Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- INDEXES ---
// Improves query performance for common lookups
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ studentId: 1 }, { sparse: true });
userSchema.index({ employeeId: 1 }, { sparse: true });

// --- VIRTUAL PROPERTIES ---
// These are not stored in the DB but are computed on the fly
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// --- INSTANCE METHODS ---
// Methods available on individual user documents

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  
  return resetToken; // Return the unhashed token to be sent to the user
};

userSchema.methods.createEmailVerificationToken = function() {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');
    
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
  
  return verifyToken;
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false; // User has not changed password yet
};

userSchema.methods.isActive = function() {
  return this.status === USER_STATUS.ACTIVE;
};

userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  this.lastActive = new Date();
  this.loginCount = (this.loginCount || 0) + 1;
  return this.save({ validateBeforeSave: false });
};

// --- STATIC METHODS ---
// Methods available on the User model itself

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ status: USER_STATUS.ACTIVE });
};

userSchema.statics.findByRole = function(role) {
  return this.find({ role });
};

// --- MIDDLEWARE (HOOKS) ---

// Pre-save hook for password hashing and ID generation
userSchema.pre('save', async function(next) {
  // Hash password if it has been modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    
    // If this is not a new user, mark when the password was changed
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // Subtract 1s to prevent JWT issues
    }
  }

  // Generate student/employee ID for new users if not provided
  if (this.isNew) {
    if (this.role === USER_ROLES.STUDENT && !this.studentId) {
      this.studentId = `STU-${Date.now()}`;
    } else if (this.role === USER_ROLES.TEACHER && !this.employeeId) {
      this.employeeId = `EMP-${Date.now()}`;
    }
  }
  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;

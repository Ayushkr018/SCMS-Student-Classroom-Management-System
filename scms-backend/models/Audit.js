/**
 * Audit Model
 * Logs significant user and system actions for security and traceability.
 */

const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  // Who performed the action
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // Not required, as some actions might be system-initiated
  },

  // What was the action
  action: {
    type: String,
    required: [true, 'Action type is required'],
    enum: [
      // Auth Actions
      'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS',
      // User Actions
      'CREATE_USER', 'UPDATE_USER', 'DELETE_USER',
      // Course Actions
      'CREATE_COURSE', 'UPDATE_COURSE', 'DELETE_COURSE', 'ENROLL_STUDENT', 'UNENROLL_STUDENT',
      // Assignment Actions
      'CREATE_ASSIGNMENT', 'UPDATE_ASSIGNMENT', 'DELETE_ASSIGNMENT',
      // Submission Actions
      'CREATE_SUBMISSION', 'UPDATE_SUBMISSION',
      // Test Actions
      'CREATE_TEST', 'UPDATE_TEST', 'DELETE_TEST', 'START_TEST', 'SUBMIT_TEST',
      // Grade Actions
      'GRADE_SUBMISSION', 'UPDATE_GRADE', 'RELEASE_GRADES',
      // System Actions
      'SYSTEM_BACKUP', 'SYSTEM_MAINTENANCE',
      // Other
      'UNKNOWN_ACTION'
    ]
  },

  // On which entity was the action performed
  entity: {
    type: String,
    required: [true, 'Entity is required'],
    enum: ['User', 'Course', 'Assignment', 'Submission', 'Test', 'Grade', 'System', 'Auth']
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  // Status of the action
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE'],
    required: [true, 'Action status is required']
  },

  // Additional context, like before/after states of data
  details: {
    type: mongoose.Schema.Types.Mixed,
  },

  // Request metadata for security
  ipAddress: {
    type: String
  },

  userAgent: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create a TTL index to automatically delete old audit logs after 1 year
auditSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

// Indexes for efficient querying
auditSchema.index({ userId: 1, action: 1 });
auditSchema.index({ entity: 1, entityId: 1 });
auditSchema.index({ action: 1 });


const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;

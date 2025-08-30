/**
 * Session Model
 * Tracks user login sessions for security and activity monitoring.
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // Reference to the user this session belongs to
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // The JWT or a refresh token associated with this session.
  // Storing the token allows for server-side revocation.
  token: {
    type: String,
    required: true,
    unique: true
  },

  // Session Metadata for security auditing
  ipAddress: {
    type: String,
    trim: true
  },

  userAgent: {
    type: String,
    trim: true
  },

  // Status and Expiration
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active'
  },

  // The date when this session token will expire
  expiresAt: {
    type: Date,
    required: true
  },

  // The last time this session was known to be active
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create a TTL (Time-To-Live) index. MongoDB will automatically delete documents
// from this collection when their 'expiresAt' date is reached. This is perfect
// for cleaning up old, expired sessions without any extra code.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// --- INSTANCE METHODS ---

/**
 * Marks the session as revoked, effectively logging the user out on their next request.
 */
sessionSchema.methods.revoke = function() {
  this.status = 'revoked';
  return this.save();
};

// --- STATIC METHODS ---

/**
 * Finds all active sessions for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} A promise that resolves to an array of active sessions.
 */
sessionSchema.statics.findActiveSessionsForUser = function(userId) {
  return this.find({ userId, status: 'active' });
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

/**
 * Notification Model
 * Real-time notification system for all users
 */

const mongoose = require('mongoose');
// const { NOTIFICATION_TYPES, USER_ROLES } = require('../utils/constants');

const notificationSchema = new mongoose.Schema({
  // Notification Content
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  type: {
    type: String,
//     enum: Object.values(NOTIFICATION_TYPES),
    enum: ['announcement', 'grade_update', 'new_assignment', 'submission_receipt', 'deadline_reminder', 'system_alert'],
    required: [true, 'Notification type is required']
  },
  
  // Targeting
  recipients: {
    type: String,
    enum: ['all', 'students', 'teachers', 'admins', 'specific_users', 'course_students', 'department'],
    required: [true, 'Recipients type is required']
  },
  
  targetUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  targetCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  
  targetDepartment: String,
  
  targetRoles: [{
    type: String,
//     enum: Object.values(USER_ROLES)
    enum: ['student', 'teacher', 'admin', 'staff']
  }],
  
  // Sender Information
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Can be null for system notifications
  },
  
  senderType: {
    type: String,
    enum: ['user', 'system', 'automatic'],
    default: 'user'
  },
  
  // Priority and Scheduling
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  
  expiresAt: Date,
  
  // Content and Media
  content: {
    html: String,
    attachments: [{
      name: String,
      url: String,
      mimeType: String
    }],
    
    actionButtons: [{
      text: String,
      action: String,
      url: String,
      style: {
        type: String,
        enum: ['primary', 'secondary', 'success', 'warning', 'danger'],
        default: 'primary'
      }
    }]
  },
  
  // Related Objects
  relatedObjectType: {
    type: String,
    enum: ['assignment', 'test', 'course', 'grade', 'submission', 'announcement']
  },
  
  relatedObjectId: {
    type: mongoose.Schema.Types.ObjectId
  },
  
  // Delivery and Tracking
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  
  deliveryStatus: {
    total: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    read: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
    default: 'draft'
  },
  
  sentAt: Date,
  
  // Settings
  settings: {
    allowReply: { type: Boolean, default: false },
    requireAcknowledgment: { type: Boolean, default: false },
    markAsImportant: { type: Boolean, default: false },
    autoDelete: { type: Boolean, default: false },
    deleteAfterDays: { type: Number, default: 30 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
notificationSchema.index({ recipients: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ senderId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Virtual properties
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

notificationSchema.virtual('deliveryRate').get(function() {
  if (this.deliveryStatus.total === 0) return 0;
  return Math.round((this.deliveryStatus.delivered / this.deliveryStatus.total) * 100);
});

notificationSchema.virtual('readRate').get(function() {
  if (this.deliveryStatus.delivered === 0) return 0;
  return Math.round((this.deliveryStatus.read / this.deliveryStatus.delivered) * 100);
});

// Instance methods
notificationSchema.methods.send = async function() {
  this.status = 'sending';
  this.sentAt = new Date();
  
  const targetUsers = await this.getTargetUsers();
  this.deliveryStatus.total = targetUsers.length;
  
  await this.save();
  
  // This part should be handled by a dedicated service to avoid circular dependencies
  // For example: eventEmitter.emit('notification:send', this, targetUsers);
  console.log(`Queueing notification ${this._id} for ${targetUsers.length} users.`);
  
  this.status = 'sent';
  return this.save();
};

notificationSchema.methods.getTargetUsers = async function() {
  const User = mongoose.model('User');
  const Student = mongoose.model('Student');
  
  let users = [];
  
  switch (this.recipients) {
    case 'all':
      users = await User.find({ status: 'active' }).select('_id');
      break;
    case 'students':
      users = await User.find({ role: 'student', status: 'active' }).select('_id');
      break;
    case 'teachers':
      users = await User.find({ role: 'teacher', status: 'active' }).select('_id');
      break;
    case 'admins':
      users = await User.find({ role: 'admin', status: 'active' }).select('_id');
      break;
    case 'specific_users':
      const userIds = this.targetUsers.map(t => t.userId);
      users = await User.find({ _id: { $in: userIds }, status: 'active' }).select('_id');
      break;
    case 'course_students':
      if (this.targetCourse) {
        const enrolledStudents = await Student.find({
          'enrolledCourses.courseId': this.targetCourse,
          'enrolledCourses.status': 'active'
        }).select('userId');
        const studentUserIds = enrolledStudents.map(s => s.userId);
        users = await User.find({_id: {$in: studentUserIds}, status: 'active'}).select('_id');
      }
      break;
    case 'department':
      if (this.targetDepartment) {
        // This assumes 'department' is a field in the User model
        users = await User.find({ 
          department: this.targetDepartment, 
          status: 'active' 
        }).select('_id');
      }
      break;
  }
  
  return users;
};

// Static methods
notificationSchema.statics.findPending = function() {
  return this.find({
    status: 'scheduled',
    scheduledFor: { $lte: new Date() }
  }).sort({ priority: -1, scheduledFor: 1 });
};

notificationSchema.statics.createSystemNotification = async function(data) {
  // A system admin user could be created, or senderId can be null
  return this.create({
    ...data,
    senderType: 'system'
  });
};

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  if (this.isModified('settings.autoDelete') && this.settings.autoDelete && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + this.settings.deleteAfterDays * 24 * 60 * 60 * 1000);
  }
  
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

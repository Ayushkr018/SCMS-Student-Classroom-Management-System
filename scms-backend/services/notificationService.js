/**
 * Notification Service
 * Real-time notifications with Socket.IO and multi-channel delivery
 */

const { Notification, User, Student, Assignment } = require('../models');
const { NOTIFICATION_TYPES } = require('../utils/constants');
// const emailService = require('./emailService'); // Assuming this service will be created
// const smsService = require('./smsService'); // Assuming this service will be created

class NotificationService {
  constructor() {
    this.io = null; // Will be set by the main app
    this.connectedUsers = new Map(); // userId -> socketId mapping
  }

  /**
   * Initialize Socket.IO
   */
  initializeSocket(io) {
    this.io = io;
    
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
      
      // Handle user authentication
      socket.on('authenticate', (data) => {
        if (data.userId) {
          this.connectedUsers.set(data.userId, socket.id);
          socket.userId = data.userId;
          socket.join(`user:${data.userId}`);
          
          // Send pending notifications
          this.sendPendingNotifications(data.userId);
        }
      });

      // Handle notification acknowledgment
      socket.on('notification_read', async (data) => {
      if (socket.userId) {
        await this.markNotificationAsRead(data.notificationId, socket.userId);
      }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Send notification to specific users
   */
  async sendNotification(notificationData) {
    try {
      // Create notification record
      const notification = await Notification.create(notificationData);
      
      // Get target users
      const targetUsers = await notification.getTargetUsers();
      
      // Send via different channels
      const deliveryPromises = [];
      
      for (const user of targetUsers) {
        // In-app notification via Socket.IO
        if (notification.channels.inApp) {
          deliveryPromises.push(this.sendInAppNotification(user._id, notification));
        }
        
        // NOTE: Email and SMS services would be implemented here
        // Email notification
        // if (notification.channels.email && user.preferences?.notifications?.email) {
        //   deliveryPromises.push(emailService.sendEmail(...));
        // }
        
        // SMS notification
        // if (notification.channels.sms && user.preferences?.notifications?.sms) {
        //   deliveryPromises.push(smsService.sendSMS(...));
        // }
        
        // Push notification
        if (notification.channels.push && user.preferences?.notifications?.push) {
          deliveryPromises.push(this.sendPushNotification(user, notification));
        }
      }
      
      // Wait for all deliveries
      const results = await Promise.allSettled(deliveryPromises);
      
      // Update delivery statistics
      const delivered = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      await Notification.findByIdAndUpdate(notification._id, {
        'deliveryStatus.total': targetUsers.length,
        'deliveryStatus.delivered': delivered,
        'deliveryStatus.failed': failed,
        status: 'sent',
        sentAt: new Date()
      });
      
      return notification;
    } catch (error) {
      console.error('Notification sending error:', error);
      throw error;
    }
  }

  /**
   * Send in-app notification via Socket.IO
   */
  async sendInAppNotification(userId, notification) {
    try {
      const userRoom = `user:${userId.toString()}`;
      if (this.io && this.connectedUsers.has(userId.toString())) {
        this.io.to(userRoom).emit('notification', {
          id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          timestamp: new Date(),
          actionButtons: notification.content?.actionButtons
        });
        return true;
      }
      
      return false; // User not connected
    } catch (error) {
      console.error('In-app notification error:', error);
      throw error;
    }
  }

  /**
   * Send email notification (placeholder)
   */
  async sendEmailNotification(user, notification) {
    try {
      console.log(`Email notification sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('Email notification error:', error);
      throw error;
    }
  }

  /**
   * Send SMS notification (placeholder)
   */
  async sendSMSNotification(user, notification) {
    try {
      if (!user.phone) {
        throw new Error('User phone number not available');
      }
      console.log(`SMS notification sent to ${user.phone}`);
      return true;
    } catch (error) {
      console.error('SMS notification error:', error);
      throw error;
    }
  }

  /**
   * Send push notification (placeholder)
   */
  async sendPushNotification(user, notification) {
    try {
      // Implement push notification logic here
      // This would integrate with services like Firebase Cloud Messaging
      console.log(`Push notification sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('Push notification error:', error);
      throw error;
    }
  }

  /**
   * Send assignment-related notifications
   */
  async sendAssignmentNotification(assignment, action) {
    const notificationData = {
      title: this.getAssignmentNotificationTitle(action, assignment),
      message: this.getAssignmentNotificationMessage(action, assignment),
      type: NOTIFICATION_TYPES.ASSIGNMENT_CREATED,
      recipients: 'course_students',
      targetCourse: assignment.courseId,
      senderId: assignment.instructorId,
      priority: 'normal',
      relatedObjectType: 'assignment',
      relatedObjectId: assignment._id,
      channels: {
        inApp: true,
        email: true,
        push: true
      },
      content: {
        actionButtons: [{
          text: 'View Assignment',
          action: 'navigate',
          url: `/assignments/${assignment._id}`,
          style: 'primary'
        }]
      }
    };

    return await this.sendNotification(notificationData);
  }

  /**
   * Send test-related notifications
   */
  async sendTestNotification(test, action) {
    const notificationData = {
      title: this.getTestNotificationTitle(action, test),
      message: this.getTestNotificationMessage(action, test),
      type: NOTIFICATION_TYPES.ANNOUNCEMENT,
      recipients: 'course_students',
      targetCourse: test.courseId,
      senderId: test.instructorId,
      priority: action === 'reminder' ? 'high' : 'normal',
      relatedObjectType: 'test',
      relatedObjectId: test._id,
      channels: {
        inApp: true,
        email: true,
        push: true
      },
      content: {
        actionButtons: [{
          text: 'View Test',
          action: 'navigate',
          url: `/tests/${test._id}`,
          style: 'primary'
        }]
      }
    };

    return await this.sendNotification(notificationData);
  }

  /**
   * Send grade notifications
   */
  async sendGradeNotification(submission) {
    const assignment = await Assignment.findById(submission.assignmentId);
    const student = await Student.findById(submission.studentId);
    
    const notificationData = {
      title: 'Grade Posted',
      message: `Your assignment "${assignment.title}" has been graded. Score: ${submission.finalScore}/${assignment.maxMarks}`,
      type: NOTIFICATION_TYPES.GRADE_POSTED,
      recipients: 'specific_users',
      targetUsers: [{ userId: student.userId }],
      senderId: assignment.instructorId,
      priority: 'normal',
      relatedObjectType: 'submission',
      relatedObjectId: submission._id,
      channels: {
        inApp: true,
        email: true,
        push: true
      },
      content: {
        actionButtons: [{
          text: 'View Grade',
          action: 'navigate',
          url: `/assignments/${assignment._id}/submission`,
          style: 'primary'
        }]
      }
    };

    return await this.sendNotification(notificationData);
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId, userId) {
    try {
      // This would update a UserNotification junction table
      // For now, we'll update the main notification
      await Notification.findByIdAndUpdate(notificationId, {
        $inc: { 'deliveryStatus.read': 1 }
      });
      
      // Emit confirmation back to user
      if (this.io) {
      const userRoom = `user:${userId.toString()}`;
        this.io.to(userRoom).emit('notification_read_confirmed', { notificationId });
      }
    } catch (error) {
      console.error('Mark notification read error:', error);
    }
  }

  /**
   * Send pending notifications to newly connected user
   */
  async sendPendingNotifications(userId) {
    try {
      // Get recent unread notifications for user
      const recentNotifications = await this.getUserNotifications(userId, { unreadOnly: true, limit: 10 });
      
      for (const notification of recentNotifications) {
        await this.sendInAppNotification(userId, notification);
      }
    } catch (error) {
      console.error('Send pending notifications error:', error);
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = options;
      
      // This is a simplified version - in production, you'd have a UserNotification model
      const student = await Student.findOne({ userId: userId });
      const enrolledCourseIds = student ? student.enrolledCourses.map(c => c.courseId) : [];

      const filter = {
        $or: [
          { recipients: 'all' },
          { recipients: 'students' },
          { 'targetUsers.userId': userId },
          { 'targetCourse': { $in: enrolledCourseIds } }
        ],
        status: 'sent'
      };

      // if (unreadOnly) {
      //   // Add read status filter when UserNotification model exists
      // }

      const skip = (page - 1) * limit;
      
      const [notifications, total] = await Promise.all([
        Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'firstName lastName'),
        Notification.countDocuments(filter)
      ]);

      return { notifications, total };
    } catch (error) {
      console.error('Get user notifications error:', error);
      return { notifications: [], total: 0 };
    }
  }

  /**
   * Helper methods for generating notification content
   */
  getAssignmentNotificationTitle(action, assignment) {
    switch (action) {
      case 'created':
        return `New Assignment: ${assignment.title}`;
      case 'published':
        return `Assignment Published: ${assignment.title}`;
      case 'reminder':
        return `Assignment Due Soon: ${assignment.title}`;
      case 'updated':
        return `Assignment Updated: ${assignment.title}`;
      default:
        return `Assignment Notification: ${assignment.title}`;
    }
  }

  getAssignmentNotificationMessage(action, assignment) {
    const dueDate = new Date(assignment.dueDate).toLocaleDateString();
    
    switch (action) {
      case 'created':
        return `A new assignment "${assignment.title}" has been created. Due date: ${dueDate}`;
      case 'published':
        return `Assignment "${assignment.title}" is now available for submission. Due date: ${dueDate}`;
      case 'reminder':
        return `Reminder: Assignment "${assignment.title}" is due on ${dueDate}`;
      case 'updated':
        return `Assignment "${assignment.title}" has been updated. Please check for changes.`;
      default:
        return `Update for assignment "${assignment.title}"`;
    }
  }

  getTestNotificationTitle(action, test) {
    switch (action) {
      case 'published':
        return `New Test: ${test.title}`;
      case 'reminder':
        return `Test Reminder: ${test.title}`;
      case 'started':
        return `Test Started: ${test.title}`;
      default:
        return `Test Notification: ${test.title}`;
    }
  }

  getTestNotificationMessage(action, test) {
    const startDate = new Date(test.schedule.startDate).toLocaleString();
    const endDate = new Date(test.schedule.endDate).toLocaleString();
    
    switch (action) {
      case 'published':
        return `Test "${test.title}" has been scheduled from ${startDate} to ${endDate}`;
      case 'reminder':
        return `Test "${test.title}" starts at ${startDate}. Duration: ${test.configuration.duration} minutes`;
      case 'started':
        return `Test "${test.title}" is now active and available for taking`;
      default:
        return `Update for test "${test.title}"`;
    }
  }
}

module.exports = new NotificationService();

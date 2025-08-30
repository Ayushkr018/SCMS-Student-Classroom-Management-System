/**
 * Socket.IO Configuration
 * Real-time communication setup
 */

const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const notificationService = require('../services/notificationService');
const proctoringService = require('../services/proctoringService');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.userEmail = decoded.email;
      
      next();
    } catch (error) {
      next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userEmail} (${socket.id})`);
    
    // Join user-specific room
    socket.join(`user:${socket.userId}`);
    socket.join(`role:${socket.userRole}`);

    // Handle different socket events
    handleNotificationEvents(socket);
    handleProctoringEvents(socket);
    handleChatEvents(socket);
    handleSystemEvents(socket);

    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.userEmail} - ${reason}`);
      
      // Clean up any active sessions
      proctoringService.handleDisconnection(socket.userId);
    });

    // Send initial data
    socket.emit('connected', {
      message: 'Connected to SCMS real-time server',
      userId: socket.userId,
      timestamp: new Date().toISOString()
    });
  });

  // Initialize services with socket instance
  notificationService.initializeSocket(io);
  proctoringService.initializeSocket(io);

  return io;
};

/**
 * Handle notification-related events
 */
const handleNotificationEvents = (socket) => {
  socket.on('get_notifications', async (data) => {
    try {
      const notifications = await notificationService.getUserNotifications(
        socket.userId, 
        data.options || {}
      );
      
      socket.emit('notifications', notifications);
    } catch (error) {
      socket.emit('error', { message: 'Failed to fetch notifications' });
    }
  });

  socket.on('mark_notification_read', async (data) => {
    try {
      await notificationService.markNotificationAsRead(data.notificationId, socket.userId);
      socket.emit('notification_read_confirmed', { notificationId: data.notificationId });
    } catch (error) {
      socket.emit('error', { message: 'Failed to mark notification as read' });
    }
  });

  socket.on('subscribe_to_course', (data) => {
    if (data.courseId) {
      socket.join(`course:${data.courseId}`);
      socket.emit('subscribed', { courseId: data.courseId });
    }
  });

  socket.on('unsubscribe_from_course', (data) => {
    if (data.courseId) {
      socket.leave(`course:${data.courseId}`);
      socket.emit('unsubscribed', { courseId: data.courseId });
    }
  });
};

/**
 * Handle proctoring-related events
 */
const handleProctoringEvents = (socket) => {
  socket.on('start_proctoring', async (data) => {
    try {
      const { sessionId, testId } = data;
      
      await proctoringService.startSession(sessionId, {
        userId: socket.userId,
        socketId: socket.id,
        testId
      });
      
      socket.join(`proctoring:${sessionId}`);
      socket.emit('proctoring_started', { sessionId });
      
    } catch (error) {
      socket.emit('proctoring_error', { message: error.message });
    }
  });

  socket.on('proctoring_event', async (data) => {
    try {
      await proctoringService.logEvent(data.sessionId, data.eventType, {
        ...data.eventData,
        timestamp: new Date(),
        socketId: socket.id
      });
      
      // Notify proctors if it's a flagged event
      if (data.eventType === 'tab_switch' || data.eventType === 'window_blur') {
        socket.to(`proctoring:${data.sessionId}`).emit('student_flagged', {
          studentId: socket.userId,
          eventType: data.eventType,
          timestamp: new Date()
        });
      }
      
    } catch (error) {
      socket.emit('proctoring_error', { message: error.message });
    }
  });

  socket.on('end_proctoring', async (data) => {
    try {
      await proctoringService.endSession(data.sessionId);
      socket.leave(`proctoring:${data.sessionId}`);
      socket.emit('proctoring_ended', { sessionId: data.sessionId });
      
    } catch (error) {
      socket.emit('proctoring_error', { message: error.message });
    }
  });
};

/**
 * Handle chat and messaging events
 */
const handleChatEvents = (socket) => {
  socket.on('join_course_chat', (data) => {
    socket.join(`chat:course:${data.courseId}`);
    socket.emit('joined_chat', { courseId: data.courseId });
  });

  socket.on('send_message', async (data) => {
    try {
      // Validate message and save to database
      const message = {
        id: require('crypto').randomBytes(16).toString('hex'),
        senderId: socket.userId,
        senderName: `${socket.userEmail}`, // You'd get this from user data
        message: data.message,
        timestamp: new Date(),
        courseId: data.courseId
      };

      // Broadcast to course chat
      socket.to(`chat:course:${data.courseId}`).emit('new_message', message);
      socket.emit('message_sent', { messageId: message.id });
      
    } catch (error) {
      socket.emit('chat_error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing_start', (data) => {
    socket.to(`chat:course:${data.courseId}`).emit('user_typing', {
      userId: socket.userId,
      userEmail: socket.userEmail
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`chat:course:${data.courseId}`).emit('user_stopped_typing', {
      userId: socket.userId
    });
  });
};

/**
 * Handle system-wide events
 */
const handleSystemEvents = (socket) => {
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });

  socket.on('get_online_users', async (data) => {
    try {
      if (socket.userRole === 'admin' || socket.userRole === 'teacher') {
        const onlineUsers = await getOnlineUsers(data.courseId);
        socket.emit('online_users', onlineUsers);
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to fetch online users' });
    }
  });
  
  // broadcast_announcement continued
        socket.on('broadcast_announcement', async (data) => {
          try {
            if (socket.userRole === 'admin' || socket.userRole === 'teacher') {
              const announcement = {
                title: data.title,
                message: data.message,
                sender: socket.userEmail,
                timestamp: new Date(),
                priority: data.priority || 'normal'
              };

              // Broadcast to specified audience
              if (data.audience === 'all') {
                io.emit('system_announcement', announcement);
              } else if (data.audience === 'course' && data.courseId) {
                io.to(`course:${data.courseId}`).emit('course_announcement', announcement);
              } else if (data.audience === 'role' && data.targetRole) {
                io.to(`role:${data.targetRole}`).emit('role_announcement', announcement);
              }

              socket.emit('announcement_sent', { success: true });
            }
          } catch (error) {
            socket.emit('error', { message: 'Failed to send announcement' });
          }
        });
      };

      /**
       * Get online users for a course
       */
      const getOnlineUsers = async (courseId) => {
        const onlineUsers = [];
        const sockets = await io.in(`course:${courseId}`).fetchSockets();
        
        for (const socket of sockets) {
          onlineUsers.push({
            userId: socket.userId,
            email: socket.userEmail,
            role: socket.userRole,
            connectedAt: socket.handshake.time
          });
        }
        
        return onlineUsers;
      };

      module.exports = { initializeSocket, io: () => io };
    ```

## 🔄 **5. Background Job Processing & Scheduling**

### **Services/queueService.js - Background Job Queue**

```
javascript
/**
 * Queue Service
 * Background job processing with Bull Queue
 */

const Queue = require('bull');
const redis = require('../config/redis');
const emailService = require('./emailService');
const notificationService = require('./notificationService');
const analyticsService = require('./analyticsService');

class QueueService {
  constructor() {
    // Initialize different queues for different job types
    this.emailQueue = new Queue('email processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      }
    });

    this.notificationQueue = new Queue('notification processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      }
    });

    this.analyticsQueue = new Queue('analytics processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      }
    });

    this.reportQueue = new Queue('report generation', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      }
    });

    // Set up job processors
    this.setupProcessors();
  }

  /**
   * Setup job processors
   */
  setupProcessors() {
    // Email queue processors
    this.emailQueue.process('send_email', 10, async (job) => {
      const { emailData } = job.data;
      return await emailService.sendEmail(emailData);
    });

    this.emailQueue.process('send_bulk_email', 5, async (job) => {
      const { recipients, emailTemplate } = job.data;
      return await emailService.sendBulkEmail(recipients, emailTemplate);
    });

    // Notification queue processors
    this.notificationQueue.process('send_notification', 20, async (job) => {
      const { notificationData } = job.data;
      return await notificationService.sendNotification(notificationData);
    });

    this.notificationQueue.process('process_pending_notifications', 1, async (job) => {
      return await notificationService.processScheduledNotifications();
    });

    // Analytics queue processors
    this.analyticsQueue.process('calculate_statistics', 3, async (job) => {
      const { type, parameters } = job.data;
      return await analyticsService.calculateStatistics(type, parameters);
    });

    this.analyticsQueue.process('generate_insights', 2, async (job) => {
      const { courseId, timeframe } = job.data;
      return await analyticsService.generateInsights(courseId, timeframe);
    });

    // Report queue processors
    this.reportQueue.process('generate_report', 2, async (job) => {
      const { reportType, parameters, userId } = job.data;
      return await this.generateReport(reportType, parameters, userId);
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for job monitoring
   */
  setupEventListeners() {
    const queues = [this.emailQueue, this.notificationQueue, this.analyticsQueue, this.reportQueue];

    queues.forEach(queue => {
      queue.on('completed', (job, result) => {
        console.log(`Job ${job.id} completed successfully`);
      });

      queue.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed:`, err.message);
      });

      queue.on('stalled', (job) => {
        console.warn(`Job ${job.id} stalled`);
      });
    });
  }

  /**
   * Add email job
   */
  async addEmailJob(jobType, data, options = {}) {
    const defaultOptions = {
      delay: 0,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: 10,
      removeOnFail: 5
    };

    return await this.emailQueue.add(jobType, data, { ...defaultOptions, ...options });
  }

  /**
   * Add notification job
   */
  async addNotificationJob(jobType, data, options = {}) {
    const defaultOptions = {
      delay: 0,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      removeOnComplete: 50,
      removeOnFail: 10
    };

    return await this.notificationQueue.add(jobType, data, { ...defaultOptions, ...options });
  }

  /**
   * Add analytics job
   */
  async addAnalyticsJob(jobType, data, options = {}) {
    const defaultOptions = {
      delay: 0,
      attempts: 2,
      removeOnComplete: 5,
      removeOnFail: 3
    };

    return await this.analyticsQueue.add(jobType, data, { ...defaultOptions, ...options });
  }

  /**
   * Add report generation job
   */
  async addReportJob(reportType, parameters, userId, options = {}) {
    const defaultOptions = {
      delay: 0,
      attempts: 2,
      timeout: 300000, // 5 minutes timeout
      removeOnComplete: 3,
      removeOnFail: 2
    };

    return await this.reportQueue.add('generate_report', 
      { reportType, parameters, userId }, 
      { ...defaultOptions, ...options }
    );
  }

  /**
   * Schedule recurring jobs
   */
  setupRecurringJobs() {
    // Process pending notifications every 5 minutes
    this.notificationQueue.add('process_pending_notifications', {}, {
      repeat: { cron: '*/5 * * * *' },
      removeOnComplete: 1,
      removeOnFail: 1
    });

    // Generate daily analytics at midnight
    this.analyticsQueue.add('calculate_statistics', 
      { type: 'daily', parameters: {} }, 
      {
        repeat: { cron: '0 0 * * *' },
        removeOnComplete: 1,
        removeOnFail: 1
      }
    );

    // Clean up old jobs weekly
    this.setupCleanupJob();
  }

  /**
   * Setup cleanup job
   */
  setupCleanupJob() {
    const cron = require('node-cron');
    
    // Run cleanup every Sunday at 2 AM
    cron.schedule('0 2 * * 0', async () => {
      try {
        console.log('Running weekly cleanup job...');
        
        // Clean completed jobs older than 7 days
        await this.emailQueue.clean(7 * 24 * 60 * 60 * 1000, 'completed');
        await this.notificationQueue.clean(7 * 24 * 60 * 60 * 1000, 'completed');
        await this.analyticsQueue.clean(7 * 24 * 60 * 60 * 1000, 'completed');
        await this.reportQueue.clean(7 * 24 * 60 * 60 * 1000, 'completed');

        // Clean failed jobs older than 3 days
        await this.emailQueue.clean(3 * 24 * 60 * 60 * 1000, 'failed');
        await this.notificationQueue.clean(3 * 24 * 60 * 60 * 1000, 'failed');
        await this.analyticsQueue.clean(3 * 24 * 60 * 60 * 1000, 'failed');
        await this.reportQueue.clean(3 * 24 * 60 * 60 * 1000, 'failed');

        console.log('Weekly cleanup completed');
      } catch (error) {
        console.error('Cleanup job failed:', error);
      }
    });
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const stats = {};

    const queues = {
      email: this.emailQueue,
      notification: this.notificationQueue,
      analytics: this.analyticsQueue,
      report: this.reportQueue
    };

    for (const [name, queue] of Object.entries(queues)) {
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed()
      ]);

      stats[name] = {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        total: waiting.length + active.length + completed.length + failed.length
      };
    }

    return stats;
  }

  /**
   * Generate report (processor function)
   */
  async generateReport(reportType, parameters, userId) {
    try {
      console.log(`Generating ${reportType} report for user ${userId}`);
      
      let report;
      
      switch (reportType) {
        case 'student_performance':
          report = await this.generateStudentPerformanceReport(parameters);
          break;
        case 'course_analytics':
          report = await this.generateCourseAnalyticsReport(parameters);
          break;
        case 'attendance_summary':
          report = await this.generateAttendanceSummaryReport(parameters);
          break;
        case 'assignment_statistics':
          report = await this.generateAssignmentStatisticsReport(parameters);
          break;
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }

      // Save report and notify user
      const reportData = {
        type: reportType,
        parameters,
        generatedBy: userId,
        generatedAt: new Date(),
        data: report
      };

      // Store report in database or file system
      const reportId = await this.saveReport(reportData);

      // Notify user that report is ready
      await this.addNotificationJob('send_notification', {
        notificationData: {
          title: 'Report Ready',
          message: `Your ${reportType} report has been generated and is ready for download.`,
          type: 'system',
          recipients: 'specific_users',
          targetUsers: [{ userId }],
          senderId: null,
          senderType: 'system',
          channels: {
            inApp: true,
            email: true
          },
          content: {
            actionButtons: [{
              text: 'Download Report',
              action: 'download',
              url: `/api/reports/${reportId}/download`
            }]
          }
        }
      });

      return { reportId, message: 'Report generated successfully' };
    } catch (error) {
      console.error('Report generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate student performance report
   */
  async generateStudentPerformanceReport(parameters) {
    const { studentId, courseId, startDate, endDate } = parameters;
    
    // Implement report generation logic
    const Grade = require('../models/Grade');
    const Submission = require('../models/Submission');
    
    const grades = await Grade.find({
      studentId,
      ...(courseId && { courseId }),
      gradedAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('courseId assessmentId');

    const submissions = await Submission.find({
      studentId,
      submittedAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('assignmentId');

    return {
      student: studentId,
      period: { startDate, endDate },
      grades,
      submissions,
      summary: {
        totalGrades: grades.length,
        averageScore: grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length,
        totalSubmissions: submissions.length,
        onTimeSubmissions: submissions.filter(s => !s.isLate).length
      }
    };
  }

  /**
   * Save report to storage
   */
  async saveReport(reportData) {
    // In a real implementation, you might save to MongoDB or file system
    const reportId = require('crypto').randomBytes(16).toString('hex');
    
    // Save to file system or database
    console.log(`Saving report ${reportId}`, reportData.type);
    
    return reportId;
  }
}

module.exports = new QueueService();

/**
 * Main Route Aggregator - Phase 3 Complete
 * All API routes with advanced features
 */

const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateJWT, optionalAuth } = require('../middleware/authMiddleware');
const rateLimiters = require('../middleware/rateLimiter');
const fileService = require('../services/fileService');

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const testRoutes = require('./testRoutes');
const gradeRoutes = require('./gradeRoutes');
const notificationRoutes = require('./notificationRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const fileRoutes = require('./fileRoutes');

// API Version and Health Check
router.get('/', (req, res) => {
  res.json({
    message: 'SCMS API v1.0 - Phase 3 Complete',
    status: 'active',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    phase: 'Phase 3 - Advanced Features & Services',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      assignments: '/api/assignments',
      tests: '/api/tests',
      grades: '/api/grades',
      notifications: '/api/notifications',
      analytics: '/api/analytics',
      files: '/api/files'
    },
    features: {
      authentication: '✅ JWT-based auth with refresh tokens',
      userManagement: '✅ Multi-role user system',
      courseManagement: '✅ Full course CRUD with enrollment',
      assignmentSystem: '✅ Assignment lifecycle with submissions',
      testingSystem: '✅ Online testing with proctoring',
      gradeManagement: '✅ Comprehensive grading system',
      fileManagement: '✅ AWS S3 integration with processing',
      notifications: '✅ Real-time notifications with Socket.IO',
      analytics: '✅ Advanced analytics and insights',
      backgroundJobs: '✅ Queue-based job processing'
    }
  });
});

// Enhanced health check with system status
router.get('/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const queueService = require('../services/queueService');
    
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const queueStats = await queueService.getQueueStats();
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        name: mongoose.connection.name,
        host: mongoose.connection.host
      },
      queues: queueStats,
      phase: 'Phase 3 Complete',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Authentication routes (public)
router.use('/auth', rateLimiters.authLimiter, authRoutes);

// User management routes (protected)
router.use('/users', authenticateJWT, userRoutes);

// Course management routes (mixed)
router.use('/courses', courseRoutes);

// Assignment routes (protected)
router.use('/assignments', authenticateJWT, assignmentRoutes);

// Test routes (protected)
router.use('/tests', authenticateJWT, testRoutes);

// Grade routes (protected)
router.use('/grades', authenticateJWT, gradeRoutes);

// Notification routes (protected)
router.use('/notifications', authenticateJWT, notificationRoutes);

// Analytics routes (protected)
router.use('/analytics', authenticateJWT, analyticsRoutes);

// File management routes (protected)
router.use('/files', authenticateJWT, fileRoutes);

// Queue monitoring routes (admin only)
router.get('/queues/stats', 
  authenticateJWT, 
  require('../middleware/authMiddleware').authorizeRoles('admin'),
  async (req, res) => {
    try {
      const queueService = require('../services/queueService');
      const stats = await queueService.getQueueStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// System status endpoint
router.get('/system/status',
  authenticateJWT,
  require('../middleware/authMiddleware').authorizeRoles('admin'),
  async (req, res) => {
    try {
      const analyticsService = require('../services/analyticsService');
      const systemStats = await analyticsService.getSystemAnalytics();
      
      res.json({
        ...systemStats,
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          cpu: process.cpuUsage(),
          version: process.version,
          platform: process.platform
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

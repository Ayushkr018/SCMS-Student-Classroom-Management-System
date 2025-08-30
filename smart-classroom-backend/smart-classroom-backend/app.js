/**
 * Express Application Configuration
 * Main app setup with middleware and routes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// Import configurations and middleware
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');
const securityConfig = require('./config/security');

// Import routes
const routes = require('./routes');

const app = express();

// Trust proxy (for deployment behind load balancers)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet(securityConfig.helmet));
app.use(cors(securityConfig.cors));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
app.use(logger);

// Rate limiting
app.use('/api/', rateLimiter);

// API Routes
app.use('/api', routes);

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SCMS Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'SCMS API Documentation',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: 'POST /api/auth/login, /api/auth/register',
      users: 'GET,POST,PUT,DELETE /api/users',
      // Add more endpoints as they are developed
    }
  });
});

// 404 handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    suggestion: 'Check /api/docs for available endpoints'
  });
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;

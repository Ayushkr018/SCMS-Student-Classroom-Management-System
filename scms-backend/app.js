/**
 * Express Application Configuration
 * Main app setup with middleware and routes
 */

require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// Import configurations and middleware
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { generalLimiter } = require('./middleware/rateLimiter');
const corsMiddleware = require('./middleware/cors');
const securityMiddleware = require('./middleware/security');


// Import routes
const routes = require('./routes');

const app = express();

// Trust proxy (for deployment behind load balancers)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(corsMiddleware);
app.use(...securityMiddleware); // Spread the array of security middleware

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb'
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
app.use(logger);

// Rate limiting
app.use('/api/', generalLimiter);

// API Routes
app.use('/api', routes);

// 404 handler for undefined API routes
app.use('/api', notFound);

// Global error handling middleware
app.use(errorHandler);

module.exports = app;

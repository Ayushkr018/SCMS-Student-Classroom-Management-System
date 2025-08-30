/**
 * Express Application Configuration
 * Main app setup with middleware and routes
 */

require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// Import configurations and middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const loggerMiddleware = require('./middleware/logger');
const { generalLimiter } = require('./middleware/rateLimiter');
const corsMiddleware = require('./middleware/cors');
const securityMiddleware = require('./middleware/security');

const app = express();

// Trust proxy (for deployment behind load balancers)
app.set('trust proxy', 1);

// Security middleware
const securitySuite = require('./middleware/security');

if (securitySuite.length > 0) {
    app.use(...securitySuite);
}

// Compression and parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply the logger middleware
app.use(loggerMiddleware);

// Rate limiting
app.use('/api/', generalLimiter);

// API Routes
// FIX: Require routes here to break potential circular dependencies
const routes = require('./routes');
app.use('/api', routes);

// 404 handler for undefined API routes
app.use('/api', notFound);

// Global error handling middleware
app.use(errorHandler);

module.exports = app;


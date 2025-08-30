/**
 * Request Logging Middleware
 * Comprehensive logging for all HTTP requests
 */

const morgan = require('morgan');
const winston = require('winston');
const { NODE_ENV, DISABLE_LOGGING } = require('../config/env');

// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'scms-backend' },
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport for development
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Create custom Morgan token for user information
morgan.token('user', (req) => {
  return req.user ? `${req.user.email} (${req.user.role})` : 'Anonymous';
});

// Create custom Morgan token for request ID
morgan.token('reqId', (req) => {
  return req.id || 'N/A';
});

// Custom Morgan format
const morganFormat = NODE_ENV === 'production' 
  ? ':remote-addr - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'
  : ':method :url :status :response-time ms - :res[content-length] - :user';

// Morgan middleware configuration
const morganOptions = {
  stream: {
    write: (message) => {
      // Remove trailing newline and log with Winston
      logger.info(message.trim());
    }
  },
  skip: (req, res) => {
    // Skip logging if disabled or if it's a health check in production
    if (DISABLE_LOGGING === 'true') return true;
    if (NODE_ENV === 'production' && req.url === '/api/health') return true;
    return false;
  }
};

// Create the Morgan middleware
const requestLogger = morgan(morganFormat, morganOptions);

// Additional custom logging middleware
const customLogger = (req, res, next) => {
  // Add request start time
  req.startTime = Date.now();
  
  // Generate unique request ID
  req.id = require('crypto').randomBytes(16).toString('hex');
  
  // Log request details in development
  if (NODE_ENV === 'development') {
    console.log(`
    📨 Incoming Request [${req.id}]
    🌍 ${req.method} ${req.originalUrl}
    👤 User: ${req.user?.email || 'Anonymous'}
    🏠 IP: ${req.ip}
    📅 Time: ${new Date().toISOString()}
    📊 Body Size: ${JSON.stringify(req.body).length} bytes
    `);
  }
  
  // Override res.json to log response details
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - req.startTime;
    
    // Log response in development
    if (NODE_ENV === 'development') {
      console.log(`
      📤 Response [${req.id}]
      ✅ Status: ${res.statusCode}
      ⏱️  Duration: ${duration}ms
      📊 Response Size: ${JSON.stringify(body).length} bytes
      `);
    }
    
    // Log errors with more detail
    if (res.statusCode >= 400) {
      logger.error('Request Error', {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        user: req.user?.email || 'Anonymous',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        duration: `${duration}ms`,
        response: body
      });
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

// Export both loggers
module.exports = NODE_ENV === 'test' 
  ? (req, res, next) => next() // Skip logging in tests
  : [customLogger, requestLogger];

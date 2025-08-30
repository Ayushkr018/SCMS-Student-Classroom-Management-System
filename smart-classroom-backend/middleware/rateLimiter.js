/**
 * Rate Limiting Middleware
 * Protects API from abuse and DoS attacks
 */

const rateLimit = require('express-rate-limit');
const { 
  RATE_LIMIT_WINDOW_MS, 
  RATE_LIMIT_MAX_REQUESTS,
  NODE_ENV 
} = require('../config/env');

/**
 * General API Rate Limiter
 */
const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // 15 minutes by default
  max: RATE_LIMIT_MAX_REQUESTS, // 100 requests per window by default
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000 / 60) // minutes
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.log(`🚫 Rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000 / 60)
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

/**
 * Strict Rate Limiter for Authentication Routes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again after 15 minutes.',
    retryAfter: 15
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`🔒 Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again after 15 minutes.',
      retryAfter: 15
    });
  }
});

/**
 * Lenient Rate Limiter for File Uploads
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    success: false,
    error: 'Upload limit exceeded. Please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Dynamic Rate Limiter Based on User Role
 */
const dynamicLimiter = (req, res, next) => {
  // Increase limits for authenticated users
  if (req.user) {
    const roleLimits = {
      student: 200,
      teacher: 500,
      admin: 1000
    };
    
    const limit = roleLimits[req.user.role] || RATE_LIMIT_MAX_REQUESTS;
    
    return rateLimit({
      windowMs: RATE_LIMIT_WINDOW_MS,
      max: limit,
      keyGenerator: (req) => `${req.ip}:${req.user.id}`, // Per user + IP
      message: {
        success: false,
        error: `Rate limit exceeded for ${req.user.role}. Limit: ${limit} requests per window.`
      }
    })(req, res, next);
  }
  
  // Use general limiter for unauthenticated requests
  return generalLimiter(req, res, next);
};

/**
 * Custom Rate Limiter for Specific Routes
 */
const createCustomLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message || 'Rate limit exceeded',
      retryAfter: Math.ceil(windowMs / 1000 / 60)
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Skip rate limiting in test environment
const skipInTest = (limiter) => {
  return NODE_ENV === 'test' 
    ? (req, res, next) => next() 
    : limiter;
};

module.exports = {
  generalLimiter: skipInTest(generalLimiter),
  authLimiter: skipInTest(authLimiter),
  uploadLimiter: skipInTest(uploadLimiter),
  dynamicLimiter: skipInTest(dynamicLimiter),
  createCustomLimiter
};

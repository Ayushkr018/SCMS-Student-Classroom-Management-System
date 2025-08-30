/**
 * Centralized Error Handling Middleware
 * Handles all application errors and formats responses
 */

const { NODE_ENV } = require('../config/env');

/**
 * Custom Error Class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB Cast Errors
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB Duplicate Field Errors
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB Validation Errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

/**
 * Send Error Response for Development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Send Error Response for Production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // Log error for debugging
    console.error('ERROR 💥', err);

    // Send generic message
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

/**
 * Main Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Set default error status code
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  // Log error details
  console.error(`
  ❌ Error in ${req.method} ${req.path}
  📧 User: ${req.user?.email || 'Anonymous'}
  🔍 Error: ${error.message}
  📊 Status: ${error.statusCode}
  ⏰ Time: ${new Date().toISOString()}
  `);

  // MongoDB bad ObjectId
  if (err.name === 'CastError') error = handleCastErrorDB(error);
  
  // MongoDB duplicate key error
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  
  // MongoDB validation error
  if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Send error response based on environment
  if (NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Handle Async Errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Handle 404 Not Found
 */
const notFound = (req, res, next) => {
  const message = `Not found - ${req.originalUrl}`;
  res.status(404).json({
    success: false,
    status: 'fail',
    message
  });
};

module.exports = {
  AppError,
  errorHandler,
  catchAsync,
  notFound
};

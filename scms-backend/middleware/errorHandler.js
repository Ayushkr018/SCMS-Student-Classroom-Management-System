/**
 * Centralized Error Handling Middleware
* Handles all application errors and formats responses
 */

const {
    NODE_ENV
} = require('../config/env');

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
    const valueMatch = err.message.match(/(["'])(\\?.)*?\1/);
    const value = valueMatch ? valueMatch[0] : 'provided value';
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
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error details
    console.error(`
  ❌ Error in ${req.method} ${req.path}
  📧 User: ${req.user?.email || 'Anonymous'}
  🔍 Error: ${err.message}
  📊 Status: ${err.statusCode}
  ⏰ Time: ${new Date().toISOString()}
  `);

    let error = { ...err,
        message: err.message
    };


    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

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
    next(new AppError(`Not found - ${req.originalUrl}`, 404));
};


module.exports = {
    AppError,
    errorHandler,
    catchAsync,
    notFound
};

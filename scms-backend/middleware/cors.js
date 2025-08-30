/**
 * CORS Middleware Configuration
 * Handles Cross-Origin Resource Sharing
 */

const cors = require('cors');
const {
    ALLOWED_ORIGINS
} = require('../config/env');
const {
    sendErrorResponse
} = require('../utils/response');

// Split the comma-separated string of origins into an array, or default for development
const whitelist = ALLOWED_ORIGINS ?
    ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) :
    ['http://localhost:3000', 'http://localhost:5173']; // Default for local dev (React, Vite)

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, or server-to-server requests)
        if (!origin) {
            return callback(null, true);
        }

        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Use a structured error that can be caught by the error handler
            const error = new Error('Not allowed by CORS');
            error.statusCode = 403;
            callback(error);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204 // For pre-flight requests
};

module.exports = cors(corsOptions);

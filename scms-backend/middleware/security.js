/**
 * Security Middleware
 * Configures various security headers and protections
 */

const helmet = require('helmet');
const hpp = require('hpp');
const { NODE_ENV } = require('../config/env');

// Configure Helmet with robust security policies
const helmetMiddleware = helmet({
    // Content Security Policy (CSP)
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for now
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    // DNS Prefetching Control
    dnsPrefetchControl: { allow: false },
    // Frameguard to prevent clickjacking
    frameguard: { action: 'deny' },
    // Hide X-Powered-By header
    hidePoweredBy: true,
    // HTTP Strict Transport Security (HSTS)
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },
    // IE No Open
    ieNoOpen: true,
    // No Sniff
    noSniff: true,
    // XSS Filter
    xssFilter: true,
});

// HTTP Parameter Pollution protection
const hppMiddleware = hpp({
    whitelist: [
        // Add any query parameters that are allowed to appear multiple times
        // e.g., 'tags', 'categories'
    ],
});

// Combine all security middleware into a single array
// Only apply the full security suite in production
const securitySuite =
    NODE_ENV === 'production'
        ? [helmetMiddleware, hppMiddleware]
        : [];

module.exports = securitySuite;

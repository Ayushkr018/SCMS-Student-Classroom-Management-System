/**
 * Authentication Middleware
 * JWT token verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { sendErrorResponse } = require('../utils/response');

/**
 * Verify JWT Token Middleware
 */
const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return sendErrorResponse(res, 401, 'Authorization header missing');
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return sendErrorResponse(res, 401, 'Invalid authorization format. Use Bearer <token>');
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return sendErrorResponse(res, 401, 'Access token missing');
    }
    
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return sendErrorResponse(res, 401, 'Token expired');
        } else if (err.name === 'JsonWebTokenError') {
          return sendErrorResponse(res, 401, 'Invalid token');
        } else {
          return sendErrorResponse(res, 401, 'Token verification failed');
        }
      }
      
      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp
      };
      
      next();
    });
    
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return sendErrorResponse(res, 500, 'Authentication error');
  }
};

/**
 * Role-based Authorization Middleware
 * @param {...string} roles - Allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendErrorResponse(res, 401, 'User not authenticated');
      }
      
      if (!roles.includes(req.user.role)) {
        return sendErrorResponse(res, 403, `Access denied. Required roles: ${roles.join(', ')}`);
      }
      
      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      return sendErrorResponse(res, 500, 'Authorization error');
    }
  };
};

/**
 * Optional JWT Authentication
 * Doesn't fail if no token is provided, just sets req.user if token exists
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  
  const token = authHeader.substring(7);
  
  if (!token) {
    return next();
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp
      };
    }
    next();
  });
};

/**
 * Check if user owns resource or is admin
 */
const authorizeResourceOwner = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendErrorResponse(res, 401, 'User not authenticated');
      }
      
      const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
      
      // Allow if user is admin or owns the resource
      if (req.user.role === 'admin' || req.user.id === resourceUserId) {
        return next();
      }
      
      return sendErrorResponse(res, 403, 'Access denied. You can only access your own resources.');
      
    } catch (error) {
      console.error('Resource authorization error:', error);
      return sendErrorResponse(res, 500, 'Authorization error');
    }
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
  optionalAuth,
  authorizeResourceOwner
};

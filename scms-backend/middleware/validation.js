/**
 * Input Validation Middleware
 * Joi-based validation for request data
 */

const Joi = require('joi');
const { sendErrorResponse } = require('../utils/response');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Property to validate (body, query, params)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      allowUnknown: false, // Don't allow unknown fields
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message.replace(/"/g, ''))
        .join(', ');
      
      return sendErrorResponse(res, 400, `Validation error: ${errorMessage}`, {
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message.replace(/"/g, ''),
          type: detail.type
        }))
      });
    }

    // Replace request property with validated/sanitized value
    req[property] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const commonSchemas = {
  // MongoDB ObjectId validation
  objectId: Joi.string().hex().length(24),
  
  // Email validation
  email: Joi.string().email().lowercase().trim(),
  
  // Password validation
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
    }),
  
  // Phone number validation
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .min(10)
    .max(15)
    .messages({
      'string.pattern.base': 'Phone number format is invalid'
    }),
  
  // Date validation
  date: Joi.date().iso(),
  
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  })
};

/**
 * User validation schemas
 */
const userSchemas = {
  register: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: commonSchemas.email.required(),
    password: commonSchemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Confirm password must match password'
      }),
    role: Joi.string().valid('student', 'teacher').required(),
    phone: commonSchemas.phone.optional(),
    dateOfBirth: commonSchemas.date.optional()
  }),

  login: Joi.object({
    email: commonSchemas.email.required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean().optional()
  }),

  update: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).optional(),
    lastName: Joi.string().trim().min(2).max(50).optional(),
    phone: commonSchemas.phone.optional(),
    dateOfBirth: commonSchemas.date.optional()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password.required(),
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({
        'any.only': 'Confirm password must match new password'
      })
  }),

  forgotPassword: Joi.object({
    email: commonSchemas.email.required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: commonSchemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Confirm password must match password'
      })
  })
};

/**
 * Course validation schemas
 */
const courseSchemas = {
  create: Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().max(500).optional(),
    code: Joi.string().trim().uppercase().min(3).max(10).required(),
    credits: Joi.number().integer().min(1).max(6).required(),
    semester: Joi.string().valid('Fall', 'Spring', 'Summer').required(),
    year: Joi.number().integer().min(2020).max(2030).required()
  }),

  update: Joi.object({
    title: Joi.string().trim().min(3).max(100).optional(),
    description: Joi.string().trim().max(500).optional(),
    credits: Joi.number().integer().min(1).max(6).optional(),
    semester: Joi.string().valid('Fall', 'Spring', 'Summer').optional(),
    year: Joi.number().integer().min(2020).max(2030).optional()
  })
};

/**
 * Query parameter validation schemas
 */
const querySchemas = {
  list: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().trim().max(100).optional()
  }),

  userList: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    role: Joi.string().valid('student', 'teacher', 'admin').optional(),
    search: Joi.string().trim().max(100).optional(),
    active: Joi.boolean().optional()
  })
};

/**
 * Parameter validation schemas
 */
const paramSchemas = {
  id: Joi.object({
    id: commonSchemas.objectId.required()
  }),

  userId: Joi.object({
    userId: commonSchemas.objectId.required()
  })
};

/**
 * Custom validation functions
 */
const customValidations = {
  /**
   * Check if value is a valid MongoDB ObjectId
   */
  isValidObjectId: (value) => {
    return /^[0-9a-fA-F]{24}$/.test(value);
  },

  /**
   * Sanitize HTML content
   */
  sanitizeHtml: (value) => {
    // Basic HTML sanitization - in production use a library like DOMPurify
    return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
};

module.exports = {
  validate,
  commonSchemas,
  userSchemas,
  courseSchemas,
  querySchemas,
  paramSchemas,
  customValidations
};

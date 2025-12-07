import DOMPurify from 'dompurify';

/**
 * Input Sanitization Utilities
 * Protects against XSS attacks and malicious inputs
 */

/**
 * Sanitize HTML content to prevent XSS
 * @param {string} dirty - Unsanitized HTML string
 * @param {object} config - DOMPurify configuration
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (dirty, config = {}) => {
  if (!dirty || typeof dirty !== 'string') return '';
  
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
    ...config,
  };
  
  return DOMPurify.sanitize(dirty, defaultConfig);
};

/**
 * Sanitize user input (removes all HTML)
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove all HTML tags
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

/**
 * Sanitize and validate email
 * @param {string} email - Email address
 * @returns {string|null} Sanitized email or null if invalid
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;
  
  const sanitized = sanitizeInput(email.trim().toLowerCase());
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) return null;
  
  return sanitized;
};

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param {string} url - URL string
 * @returns {string|null} Sanitized URL or null if invalid
 */
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  const sanitized = url.trim();
  
  // Block dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(sanitized)) {
    console.warn('Blocked dangerous URL protocol:', sanitized);
    return null;
  }
  
  // Allow only http, https, mailto, and relative URLs
  const validProtocols = /^(https?:\/\/|mailto:|\/|\.\/|\.\.\/)/i;
  if (!validProtocols.test(sanitized) && !sanitized.startsWith('#')) {
    console.warn('Invalid URL protocol:', sanitized);
    return null;
  }
  
  return sanitized;
};

/**
 * Sanitize object - recursively sanitize all string values
 * @param {object} obj - Object to sanitize
 * @returns {object} Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Validate and sanitize form data
 * @param {object} formData - Form data object
 * @param {object} schema - Validation schema
 * @returns {object} { isValid: boolean, data: object, errors: object }
 */
export const validateFormData = (formData, schema) => {
  const errors = {};
  const sanitizedData = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];
    
    // Required check
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (!value) {
      sanitizedData[field] = '';
      continue;
    }
    
    // Type-specific sanitization
    let sanitized = value;
    
    if (rules.type === 'email') {
      sanitized = sanitizeEmail(value);
      if (!sanitized) {
        errors[field] = 'Invalid email format';
        continue;
      }
    } else if (rules.type === 'url') {
      sanitized = sanitizeURL(value);
      if (!sanitized) {
        errors[field] = 'Invalid URL format';
        continue;
      }
    } else if (rules.type === 'string') {
      sanitized = sanitizeInput(value);
    }
    
    // Length validation
    if (rules.minLength && sanitized.length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      continue;
    }
    
    if (rules.maxLength && sanitized.length > rules.maxLength) {
      errors[field] = `${field} must not exceed ${rules.maxLength} characters`;
      continue;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(sanitized)) {
      errors[field] = rules.patternMessage || `${field} format is invalid`;
      continue;
    }
    
    // Custom validation
    if (rules.validate && !rules.validate(sanitized)) {
      errors[field] = rules.validateMessage || `${field} is invalid`;
      continue;
    }
    
    sanitizedData[field] = sanitized;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    data: sanitizedData,
    errors,
  };
};

/**
 * Escape special characters for display
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHTML = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Sanitize filename to prevent path traversal
 * @param {string} filename - Filename to sanitize
 * @returns {string} Safe filename
 */
export const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  
  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, '');
  
  // Remove special characters except dot, dash, underscore
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit length
  if (safe.length > 255) {
    safe = safe.substring(0, 255);
  }
  
  return safe;
};

/**
 * Validate and sanitize number input
 * @param {any} value - Value to validate
 * @param {object} options - Validation options { min, max, integer }
 * @returns {number|null} Sanitized number or null
 */
export const sanitizeNumber = (value, options = {}) => {
  const num = Number(value);
  
  if (isNaN(num)) return null;
  
  if (options.integer && !Number.isInteger(num)) return null;
  
  if (options.min !== undefined && num < options.min) return null;
  
  if (options.max !== undefined && num > options.max) return null;
  
  return num;
};

export default {
  sanitizeHTML,
  sanitizeInput,
  sanitizeEmail,
  sanitizeURL,
  sanitizeObject,
  validateFormData,
  escapeHTML,
  sanitizeFilename,
  sanitizeNumber,
};

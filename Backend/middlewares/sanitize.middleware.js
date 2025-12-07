/**
 * Input Sanitization Middleware
 * Additional layer of input validation and sanitization
 */

const Logger = require('../utils/logger')

/**
 * Sanitize string inputs
 * Remove potentially dangerous characters while preserving valid content
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str
  
  // Trim whitespace
  str = str.trim()
  
  // Remove null bytes
  str = str.replace(/\0/g, '')
  
  return str
}

/**
 * Deep sanitize object recursively
 */
function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj
  
  if (typeof obj === 'string') {
    return sanitizeString(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  
  if (typeof obj === 'object') {
    const sanitized = {}
    for (const [key, value] of Object.entries(obj)) {
      // Skip prototype pollution attempts
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        Logger.security('Prototype pollution attempt detected', { key })
        continue
      }
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

/**
 * Middleware to sanitize request inputs
 */
function sanitizeInput(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params)
  }
  
  next()
}

/**
 * Validate MongoDB ObjectId
 */
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

/**
 * Middleware to validate ObjectId parameters
 */
function validateObjectId(...paramNames) {
  return (req, res, next) => {
    for (const param of paramNames) {
      const id = req.params[param] || req.body[param] || req.query[param]
      
      if (id && !isValidObjectId(id)) {
        return res.status(400).json({
          status: 'error',
          error: `Invalid ${param} format`,
        })
      }
    }
    
    next()
  }
}

/**
 * Prevent mass assignment attacks
 * Only allow specified fields
 */
function allowOnly(allowedFields) {
  return (req, res, next) => {
    if (!req.body) return next()
    
    const sanitized = {}
    for (const field of allowedFields) {
      if (req.body.hasOwnProperty(field)) {
        sanitized[field] = req.body[field]
      }
    }
    
    req.body = sanitized
    next()
  }
}

module.exports = {
  sanitizeInput,
  sanitizeString,
  sanitizeObject,
  isValidObjectId,
  validateObjectId,
  allowOnly,
}

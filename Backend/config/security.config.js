const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const compression = require('compression')

/**
 * Configure Helmet for security headers
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
})

/**
 * Rate limiting configuration
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Stricter rate limiting for authentication endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
})

/**
 * Rate limiting for booking endpoints
 */
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 booking requests per windowMs
  message: 'Too many booking requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * NoSQL injection sanitization
 */
const mongoSanitizeConfig = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[Security] Sanitized key: ${key} in request from ${req.ip}`)
  },
})

/**
 * XSS protection
 */
const xssConfig = xss()

/**
 * HTTP Parameter Pollution protection
 */
const hppConfig = hpp({
  whitelist: ['seatNumbers', 'seatNumber', 'showId', 'movieId'], // Allow duplicates for these params
})

/**
 * Compression middleware
 */
const compressionConfig = compression()

module.exports = {
  helmetConfig,
  generalLimiter,
  authLimiter,
  bookingLimiter,
  mongoSanitizeConfig,
  xssConfig,
  hppConfig,
  compressionConfig,
}

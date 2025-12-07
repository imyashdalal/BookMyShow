const AppError = require('../errors/app.error')

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging (in production, use proper logging service)
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  })

  // Handle AppError (custom application errors)
  if (err instanceof AppError) {
    return res.status(err.code).json({
      status: 'error',
      error: err.message,
    })
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      status: 'error',
      error: 'Validation Error',
      details: errors,
    })
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(409).json({
      status: 'error',
      error: `Duplicate value for field: ${field}`,
    })
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      error: 'Invalid data format',
    })
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      error: 'Invalid token',
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      error: 'Token expired',
    })
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return res.status(400).json({
      status: 'error',
      error: 'Validation Error',
      details: errors,
    })
  }

  // Default error response (hide internal details in production)
  const statusCode = err.statusCode || 500
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Something went wrong'

  return res.status(statusCode).json({
    status: 'error',
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    status: 'error',
    error: `Route ${req.originalUrl} not found`,
  })
}

/**
 * Async error wrapper - catches errors in async route handlers
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
}

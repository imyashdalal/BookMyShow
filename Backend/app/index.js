const express = require('express')
const cors = require('cors')

const adminRoutes = require('../routes/admin.routes')
const bookingRoutes = require('../routes/booking.routes')
const authRoutes = require('../routes/auth.routes')
const publicRoutes = require('../routes/public.routes')

const { authenticationMiddleware } = require('../middlewares/auth.middleware.js')
const { errorHandler, notFoundHandler } = require('../middlewares/error.middleware')
const Logger = require('../utils/logger')
const corsOptions = require('../config/cors.config')
const {
  helmetConfig,
  generalLimiter,
  authLimiter,
  bookingLimiter,
  mongoSanitizeConfig,
  xssConfig,
  hppConfig,
  compressionConfig,
} = require('../config/security.config')

const app = express()

// Trust proxy - important for rate limiting and IP detection behind reverse proxies
app.set('trust proxy', 1)

// Security Middleware
app.use(helmetConfig) // Security headers
app.use(compressionConfig) // Compress responses
app.use(mongoSanitizeConfig) // Prevent NoSQL injection
app.use(xssConfig) // Prevent XSS attacks
app.use(hppConfig) // Prevent HTTP parameter pollution

// CORS Configuration
app.use(cors(corsOptions))

// Body parsing middleware
app.use(express.json({ limit: '10mb' })) // Limit body size to prevent DOS
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(Logger.requestLogger)
}

// General rate limiting
app.use('/api', generalLimiter)

// Authentication middleware
app.use(authenticationMiddleware)

// Health check endpoint (no rate limiting)
app.get('/', (req, res) =>
  res.json({ status: 'success', message: 'Server is up and running' })
)

app.get('/health', (req, res) =>
  res.json({ 
    status: 'success', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
)

// Routes with specific rate limiters
app.use('/admin', adminRoutes)
app.use('/auth', authLimiter, authRoutes) // Stricter rate limiting for auth
app.use('/booking', bookingLimiter, bookingRoutes) // Rate limiting for bookings
app.use('/api', publicRoutes)

// 404 handler
app.use(notFoundHandler)

// Global error handler (must be last)
app.use(errorHandler)

module.exports = app

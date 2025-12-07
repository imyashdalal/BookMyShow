const http = require('http')
const { Server } = require('socket.io')
const expressApplication = require('./app')
const connectMongoDB = require('./models')
const Logger = require('./utils/logger')

const PORT = process.env.PORT ?? 8000

// Allowed origins for Socket.IO
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [process.env.CLIENT_URL || 'http://localhost:5173']

async function init() {
  try {
    await connectMongoDB(process.env.MONGODB_URI)
    Logger.info('MongoDB Connected')

    const server = http.createServer(expressApplication)
    
    // Initialize Socket.IO with security configurations
    const io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
      },
      // Additional security settings
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e6, // 1MB max message size
      allowEIO3: false, // Disable older protocol versions
      transports: ['websocket', 'polling'],
    })

    // Make io available to the app
    expressApplication.set('io', io)

    // Socket.IO connection handling with validation
    io.on('connection', (socket) => {
      Logger.info('Socket.IO client connected', { socketId: socket.id, ip: socket.handshake.address })

      // Join a show room with validation
      socket.on('join-show', (showId) => {
        // Validate showId format (MongoDB ObjectId)
        if (typeof showId === 'string' && /^[0-9a-fA-F]{24}$/.test(showId)) {
          socket.join(`show-${showId}`)
          Logger.debug(`Socket ${socket.id} joined show-${showId}`)
        } else {
          Logger.warn('Invalid showId in join-show event', { socketId: socket.id, showId })
          socket.emit('error', 'Invalid show ID')
        }
      })

      // Leave a show room with validation
      socket.on('leave-show', (showId) => {
        if (typeof showId === 'string' && /^[0-9a-fA-F]{24}$/.test(showId)) {
          socket.leave(`show-${showId}`)
          Logger.debug(`Socket ${socket.id} left show-${showId}`)
        } else {
          Logger.warn('Invalid showId in leave-show event', { socketId: socket.id, showId })
        }
      })

      // Handle errors
      socket.on('error', (error) => {
        Logger.error('Socket.IO error', { socketId: socket.id, error: error.message })
      })

      socket.on('disconnect', (reason) => {
        Logger.info('Socket.IO client disconnected', { socketId: socket.id, reason })
      })
    })

    server.listen(PORT, () => {
      Logger.info(`Server started on port ${PORT}`)
      Logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (err) {
    Logger.error('Error starting server', { error: err.message, stack: err.stack })
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    Logger.info('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  Logger.info('SIGINT signal received: closing HTTP server')
  process.exit(0)
})

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Rejection', { reason, promise })
})

process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception', { error: error.message, stack: error.stack })
  process.exit(1)
})

init()

/**
 * Simple logging utility
 * In production, consider using winston or pino for advanced logging
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
}

class Logger {
  static log(level, message, meta = {}) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    }

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry))
    } else {
      // Development: pretty print
      console.log(`[${timestamp}] ${level}: ${message}`, meta)
    }
  }

  static error(message, meta = {}) {
    this.log(LOG_LEVELS.ERROR, message, meta)
  }

  static warn(message, meta = {}) {
    this.log(LOG_LEVELS.WARN, message, meta)
  }

  static info(message, meta = {}) {
    this.log(LOG_LEVELS.INFO, message, meta)
  }

  static debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LOG_LEVELS.DEBUG, message, meta)
    }
  }

  /**
   * Log security events
   */
  static security(event, details = {}) {
    this.warn(`SECURITY: ${event}`, {
      ...details,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Log authentication events
   */
  static auth(event, userId, details = {}) {
    this.info(`AUTH: ${event}`, {
      userId,
      ...details,
    })
  }

  /**
   * Log API requests (middleware)
   */
  static requestLogger(req, res, next) {
    const start = Date.now()
    
    res.on('finish', () => {
      const duration = Date.now() - start
      Logger.info('API Request', {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      })
    })
    
    next()
  }
}

module.exports = Logger

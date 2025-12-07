/**
 * Socket.IO utility functions for emitting seat updates
 */

/**
 * Emit seat lock event to all clients in a show room
 * @param {Object} io - Socket.IO server instance
 * @param {String} showId - Show ID
 * @param {Array} seatNumbers - Array of seat numbers locked
 * @param {String} userId - User ID who locked the seats
 */
function emitSeatsLocked(io, showId, seatNumbers, userId) {
  io.to(`show-${showId}`).emit('seats-locked', {
    showId,
    seatNumbers,
    userId,
    timestamp: new Date()
  })
}

/**
 * Emit seat unlock event to all clients in a show room
 * @param {Object} io - Socket.IO server instance
 * @param {String} showId - Show ID
 * @param {Array} seatNumbers - Array of seat numbers unlocked
 * @param {String} userId - User ID who unlocked the seats
 */
function emitSeatsUnlocked(io, showId, seatNumbers, userId) {
  io.to(`show-${showId}`).emit('seats-unlocked', {
    showId,
    seatNumbers,
    userId,
    timestamp: new Date()
  })
}

/**
 * Emit seat booking event to all clients in a show room
 * @param {Object} io - Socket.IO server instance
 * @param {String} showId - Show ID
 * @param {Array} seatNumbers - Array of seat numbers booked
 * @param {String} userId - User ID who booked the seats
 */
function emitSeatsBooked(io, showId, seatNumbers, userId) {
  io.to(`show-${showId}`).emit('seats-booked', {
    showId,
    seatNumbers,
    userId,
    timestamp: new Date()
  })
}

/**
 * Emit seat status update to all clients in a show room
 * @param {Object} io - Socket.IO server instance
 * @param {String} showId - Show ID
 * @param {Object} status - Complete seat status
 */
function emitSeatStatusUpdate(io, showId, status) {
  io.to(`show-${showId}`).emit('seat-status-update', {
    showId,
    ...status,
    timestamp: new Date()
  })
}

module.exports = {
  emitSeatsLocked,
  emitSeatsUnlocked,
  emitSeatsBooked,
  emitSeatStatusUpdate
}

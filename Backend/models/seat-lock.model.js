const { Schema, model } = require('mongoose')

const seatLockSchema = new Schema(
  {
    showId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'theatreHallMovieMapping',
      index: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
)

// Compound index to ensure a seat can only be locked once per show
seatLockSchema.index({ showId: 1, seatNumber: 1 }, { unique: true })

// TTL index to automatically delete expired locks
seatLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const SeatLock = model('seatLock', seatLockSchema)

module.exports = SeatLock

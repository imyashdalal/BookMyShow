const { Schema, model } = require('mongoose')

const movieReviewSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'movie',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: 1000,
    },
    isVerifiedBooking: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

movieReviewSchema.index({ movieId: 1, userId: 1 }, { unique: true })

const MovieReview = model('movieReview', movieReviewSchema)

module.exports = MovieReview

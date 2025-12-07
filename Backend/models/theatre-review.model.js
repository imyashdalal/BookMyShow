const { Schema, model } = require('mongoose')

const theatreReviewSchema = new Schema(
  {
    theatreId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'theatre',
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
    categories: {
      seating: { type: Number, min: 1, max: 5 },
      soundQuality: { type: Number, min: 1, max: 5 },
      screenQuality: { type: Number, min: 1, max: 5 },
      cleanliness: { type: Number, min: 1, max: 5 },
      foodAndBeverages: { type: Number, min: 1, max: 5 },
    },
    isVerifiedBooking: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

theatreReviewSchema.index({ theatreId: 1, userId: 1 }, { unique: true })

const TheatreReview = model('theatreReview', theatreReviewSchema)

module.exports = TheatreReview

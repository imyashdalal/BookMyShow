const { Schema, model } = require('mongoose')

const criticReviewSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'movie',
    },
    criticName: {
      type: String,
      required: true,
    },
    publication: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

criticReviewSchema.index({ movieId: 1, criticName: 1, publication: 1 }, { unique: true })

const CriticReview = model('criticReview', criticReviewSchema)

module.exports = CriticReview

const { Schema, model } = require('mongoose')

const theatreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    plot: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
    },
    lon: {
      type: String,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Theatre = model('theatre', theatreSchema)

module.exports = Theatre

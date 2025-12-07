const { Schema, model } = require('mongoose')

const moviesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    language: {
      type: String,
    },
    genre: {
      type: [String],
      enum: [
        'Action',
        'Adventure',
        'Animation',
        'Biography',
        'Comedy',
        'Crime',
        'Documentary',
        'Drama',
        'Family',
        'Fantasy',
        'Horror',
        'Musical',
        'Mystery',
        'Romance',
        'Sci-Fi',
        'Thriller',
        'War',
        'Western'
      ],
      default: [],
    },
    categories: {
      type: [String],
      enum: ['2D', '3D', 'IMAX', 'IMAX 3D', '4DX', 'MX4D', 'ScreenX', 'Dolby Cinema', 'Standard'],
      default: [],
    },
    adultRating: {
      type: String,
      enum: ['U', 'UA', 'A', 'S', 'U/A 7+', 'U/A 13+', 'U/A 16+'], // U: Universal, UA: Universal Adult, A: Adult, S: Restricted
      default: 'U',
    },
    imageURL: {
      type: String,
    },
    durationInMinutes: {
      type: Number,
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
    criticRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
)

const Movie = model('movie', moviesSchema)

module.exports = Movie
const { Schema, model } = require('mongoose')

const movieRoleMappingSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'movie',
      required: true,
    },
    personId: {
      type: Schema.Types.ObjectId,
      ref: 'person',
      required: true,
    },
    role: {
      type: String,
      enum: ['actor', 'actress', 'director', 'producer'],
      required: true,
    },
    characterName: {
      type: String,
      trim: true,
      // This is only applicable for actors/actresses
    },
    order: {
      type: Number,
      default: 0,
      // Used to maintain the order of cast/crew members (e.g., lead actor first)
    },
    isCameo: {
      type: Boolean,
      default: false,
      // Indicates if this is a cameo/special appearance
    },
  },
  { timestamps: true }
)

// Compound indexes for efficient queries
movieRoleMappingSchema.index({ movieId: 1, role: 1 })
movieRoleMappingSchema.index({ personId: 1 })
movieRoleMappingSchema.index({ movieId: 1, personId: 1 }, { unique: true })

const MovieRoleMapping = model('movieRoleMapping', movieRoleMappingSchema)

module.exports = MovieRoleMapping

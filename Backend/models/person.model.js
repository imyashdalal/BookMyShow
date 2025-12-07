const { Schema, model } = require('mongoose')

const personSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    imageURL: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    placeOfBirth: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    knownFor: {
      type: [String],
      default: [],
      // Array of notable works or achievements
    },
    awards: {
      type: [String],
      default: [],
      // Array of awards won
    },
    socialMedia: {
      instagram: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      website: { type: String },
    },
  },
  { timestamps: true }
)

// Index for searching by name
personSchema.index({ name: 1 })

const Person = model('person', personSchema)

module.exports = Person

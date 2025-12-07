const { z } = require('zod')

// MongoDB ObjectId validation regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/

const createTheatreValidationSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters').max(100, 'Name too long'),
  plot: z.string().trim().min(3).max(200),
  street: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  country: z.string().trim().min(2).max(100),
  lat: z.string().regex(/^-?([1-8]?[0-9]\.{1}\d{1,6}|90\.{1}0{1,6})$/, 'Invalid latitude').optional(),
  lon: z.string().regex(/^-?((1[0-7][0-9]|[1-9]?[0-9])\.{1}\d{1,6}|180\.{1}0{1,6})$/, 'Invalid longitude').optional(),
  pinCode: z.number().int().min(100000).max(999999, 'Invalid PIN code'),
})

const createTheatreHallSchema = z.object({
  number: z.number().int().min(1, 'Hall number must be positive').max(100, 'Hall number too large'),
  seatingCapacity: z.number().int().min(1, 'Seating capacity must be at least 1').max(10000, 'Seating capacity too large'),
  theatreId: z.string().regex(objectIdRegex, 'Invalid theatre ID format'),
})

const createTheatreHallMovieMappingSchema = z.object({
  movieId: z.string().regex(objectIdRegex, 'Invalid movie ID format'),
  theatreHallId: z.string().regex(objectIdRegex, 'Invalid theatre hall ID format'),
  showDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTimestamp: z.string().datetime('Invalid start timestamp'),
  endTimestamp: z.string().datetime('Invalid end timestamp'),
  price: z.number().min(0, 'Price cannot be negative').max(10000, 'Price too high'),
})

module.exports = {
  createTheatreValidationSchema,
  createTheatreHallSchema,
  createTheatreHallMovieMappingSchema,
}


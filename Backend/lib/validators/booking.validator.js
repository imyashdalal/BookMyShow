const { z } = require('zod')

// MongoDB ObjectId validation regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/

const bookingCreationValidationSchema = z.object({
  showId: z.string().regex(objectIdRegex, 'Invalid showId format'),
  seatNumber: z.array(z.number().int().min(1).max(1000))
    .min(1, 'At least one seat must be selected')
    .max(10, 'Cannot book more than 10 seats at once'),
  totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
    .refine(val => parseFloat(val) > 0, 'Price must be greater than 0')
    .refine(val => parseFloat(val) < 100000, 'Price seems unusually high'),
})

const verifyPaymentValidationSchema = z.object({
  showId: z.string().regex(objectIdRegex, 'Invalid showId format'),
  orderId: z.string().min(1).max(100),
  seatNumber: z.array(z.number().int().min(1).max(1000))
    .min(1)
    .max(10),
})

const createBookingValidationSchema = z.object({
  showId: z.string().regex(objectIdRegex, 'Invalid showId format'), 
  seatNumber: z.array(z.number().int().min(1).max(1000))
    .min(1, 'At least one seat must be selected')
    .max(10, 'Cannot book more than 10 seats at once'),
  paymentId: z.string().min(1).max(200),
})

const lockSeatsValidationSchema = z.object({
  showId: z.string().regex(objectIdRegex, 'Invalid showId format'),
  seatNumbers: z.array(z.number().int().min(1).max(1000))
    .min(1, 'At least one seat must be selected')
    .max(10, 'Cannot lock more than 10 seats at once'),
})

const unlockSeatsValidationSchema = z.object({
  showId: z.string().regex(objectIdRegex, 'Invalid showId format'),
  seatNumbers: z.array(z.number().int().min(1).max(1000))
    .optional(),
})

const seatStatusValidationSchema = z.object({
  showId: z.string().regex(objectIdRegex, 'Invalid showId format'),
})

module.exports = {
  bookingCreationValidationSchema,
  verifyPaymentValidationSchema,
  createBookingValidationSchema,
  lockSeatsValidationSchema,
  unlockSeatsValidationSchema,
  seatStatusValidationSchema,
}

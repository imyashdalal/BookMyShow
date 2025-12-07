const TheatreService = require('../services/theatre.service')
const TheatreReview = require('../models/theatre-review.model')
const {
  createTheatreValidationSchema,
  createTheatreHallSchema,
  createTheatreHallMovieMappingSchema,
} = require('../lib/validators/theatre.validators')

async function getAllTheatres(req, res) {
  const theatres = await TheatreService.getAll()
  return res.json({ data: theatres })
}

async function createTheatre(req, res) {
  const validationStatus = await createTheatreValidationSchema.safeParseAsync(
    req.body
  )

  if (validationStatus.error)
    return res.status(400).json({ error: validationStatus.error })

  const theatre = await TheatreService.create(validationStatus.data)

  return res.status(201).json({ status: 'success', data: theatre })
}

async function getTheatreById(req, res) {
  const theatreId = req.params.id
  const theatre = await TheatreService.getById(theatreId)

  if (!theatre)
    return res.status(404).json({
      status: 'error',
      error: `Theatre with id ${theatreId} not found`,
    })

  return res.json({ status: 'success', data: theatre })
}

// Controller for halls
async function getTheatreHallsByTheatreId(req, res) {
  const theatreId = req.params.theatreId
  const halls = await TheatreService.getHallsByTheatreId(theatreId)
  return res.json({ status: 'success', data: halls })
}

async function createTheatreHall(req, res) {
  const validationResult = await createTheatreHallSchema.safeParseAsync(
    req.body
  )

  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error })

  const hall = await TheatreService.createTheatreHall(validationResult.data)

  return res.json({ status: 'success', data: hall })
}

async function createShow(req, res) {
  const validationResult =
    await createTheatreHallMovieMappingSchema.safeParseAsync(req.body)

  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error })

  const { endTimestamp, movieId, price,showDate, startTimestamp, theatreHallId } =
    validationResult.data

  const TheaterHall = await TheatreService.getHallbyId(theatreHallId);
  const Theatre = await TheatreService.getById(TheaterHall.theatreId);

  const hall = await TheatreService.createShow({
    endTimestamp,
    movieId,
    price,
    showDate,
    startTimestamp,
    theatreHallId,
    city: Theatre.city.toLowerCase(),
  })

  return res.status(201).json({ status: 'success', data: hall })
}

async function listShowsByMovieId(req, res) {
  const movieId = req.params.movieId
  const shows = await TheatreService.getShowsByMovieId(movieId)
  return res.status(200).json({ data: shows })
}

async function listShowsByMovieIdAndCity(req, res) {
  const lowerCase = req.params.city
  const movieId = req.params.movieId
  const city = lowerCase.toLowerCase();
  const shows = await TheatreService.getShowsByMovieIdExtended(movieId, city )
  return res.status(200).json({ data: shows })
}

async function getTheatreReviews(req, res) {
  try {
    const { theatreId } = req.params
    const reviews = await TheatreReview.find({ theatreId })
      .populate('userId', 'firstname lastname')
      .sort({ createdAt: -1 })
    
    return res.json({ status: 'success', data: reviews })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function createTheatreReview(req, res) {
  try {
    const { theatreId, rating, review, categories } = req.body
    const userId = req.user._id

    // Check if user already reviewed this theatre
    const existingReview = await TheatreReview.findOne({ theatreId, userId })
    if (existingReview) {
      return res.status(400).json({ 
        error: 'You have already reviewed this theatre' 
      })
    }

    const newReview = await TheatreReview.create({
      theatreId,
      userId,
      rating,
      review,
      categories,
      isVerifiedBooking: false // You can enhance this to check actual bookings
    })

    const populatedReview = await TheatreReview.findById(newReview._id)
      .populate('userId', 'firstname lastname')

    return res.status(201).json({ 
      status: 'success', 
      data: populatedReview 
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllTheatres,
  createTheatre,
  getTheatreById,
  getTheatreHallsByTheatreId,
  createTheatreHall,
  createShow,
  listShowsByMovieId,
  listShowsByMovieIdAndCity,
  getTheatreReviews,
  createTheatreReview,
}

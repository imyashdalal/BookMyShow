const MovieService = require('../services/movie.service')
const {
  createMovieValidationSchema,
} = require('../lib/validators/movie.validators')
const MovieRoleMapping = require('../models/movie-role-mapping.model')
const CriticReview = require('../models/critic-review.model')
const MovieReview = require('../models/movie-review.model')
const Person = require('../models/person.model')

async function getAllMovies(req, res) {
  const movies = await MovieService.getAll()
  return res.json({ data: movies })
}

async function getMovieById(req, res) {
  const id = req.params.id
  const movie = await MovieService.getById(id)

  if (!movie) return res.status(404).json({ error: 'Movie not found' })

  return res.json({ status: 'success', data: movie })
}

async function getMovieCast(req, res) {
  try {
    const { movieId } = req.params
    const cast = await MovieRoleMapping.find({
      movieId,
      role: { $in: ['actor', 'actress'] }
    })
      .populate('personId')
      .sort({ order: 1 })
    
    return res.json({ status: 'success', data: cast })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function getMovieCrew(req, res) {
  try {
    const { movieId } = req.params
    const crew = await MovieRoleMapping.find({
      movieId,
      role: { $in: ['director', 'producer'] }
    })
      .populate('personId')
      .sort({ order: 1 })
    
    return res.json({ status: 'success', data: crew })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function getMovieRoles(req, res) {
  try {
    const { movieId } = req.params
    const roles = await MovieRoleMapping.find({ movieId })
      .populate('personId')
      .sort({ order: 1 })
    
    return res.json({ status: 'success', data: roles })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function getCriticReviews(req, res) {
  try {
    const { movieId } = req.params
    const reviews = await CriticReview.find({ movieId })
      .sort({ reviewDate: -1 })
    
    return res.json({ status: 'success', data: reviews })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function getMovieReviews(req, res) {
  try {
    const { movieId } = req.params
    const reviews = await MovieReview.find({ movieId })
      .populate('userId', 'firstname lastname')
      .sort({ createdAt: -1 })
    
    return res.json({ status: 'success', data: reviews })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function createMovieReview(req, res) {
  try {
    const { movieId, rating, review } = req.body
    const userId = req.user._id

    // Check if user already reviewed this movie
    const existingReview = await MovieReview.findOne({ movieId, userId })
    if (existingReview) {
      return res.status(400).json({ 
        error: 'You have already reviewed this movie' 
      })
    }

    const newReview = await MovieReview.create({
      movieId,
      userId,
      rating,
      review,
      isVerifiedBooking: false // You can enhance this to check actual bookings
    })

    const populatedReview = await MovieReview.findById(newReview._id)
      .populate('userId', 'firstname lastname')

    return res.status(201).json({ 
      status: 'success', 
      data: populatedReview 
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function createMovie(req, res) {
  const validationResult = await createMovieValidationSchema.safeParseAsync(
    req.body
  )

  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error })

  const { title, description, durationInMinutes, imageURL, language } =
    validationResult.data

  const movie = await MovieService.createMovie({
    title,
    description,
    durationInMinutes,
    imageURL,
    language,
  })

  return res.status(201).json({ status: 'success', data: movie })
}

async function getPersonById(req, res) {
  try {
    const { id } = req.params
    const person = await Person.findById(id)
    
    if (!person) {
      return res.status(404).json({ error: 'Person not found' })
    }
    
    return res.json({ status: 'success', data: person })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function getMoviesByPerson(req, res) {
  try {
    const { id } = req.params
    const movieRoles = await MovieRoleMapping.find({ personId: id })
      .populate('movieId')
      .sort({ 'movieId.releaseDate': -1 })
    
    return res.json({ status: 'success', data: movieRoles })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = { 
  getAllMovies, 
  createMovie, 
  getMovieById,
  getMovieCast,
  getMovieCrew,
  getMovieRoles,
  getCriticReviews,
  getMovieReviews,
  createMovieReview,
  getPersonById,
  getMoviesByPerson
}

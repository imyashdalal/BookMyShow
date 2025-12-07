const express = require('express')
const movieController = require('../controllers/movie.controller')
const theatreController = require('../controllers/theatre.controller')
const { authenticate } = require('../middlewares/auth.middleware')

const router = express.Router()

router.get('/movies', movieController.getAllMovies)
router.get('/movies/:id', movieController.getMovieById)
router.get('/movies/:movieId/cast', movieController.getMovieCast)
router.get('/movies/:movieId/crew', movieController.getMovieCrew)
router.get('/movies/:movieId/roles', movieController.getMovieRoles)
router.get('/movies/:movieId/reviews', movieController.getMovieReviews)
router.get('/movies/:movieId/critic-reviews', movieController.getCriticReviews)

// Protected review routes
router.post('/movie-reviews', authenticate, movieController.createMovieReview)

// Person routes
router.get('/persons/:id', movieController.getPersonById)
router.get('/persons/:id/movies', movieController.getMoviesByPerson)

// Theatre review routes
router.get('/theatres/:theatreId/reviews', theatreController.getTheatreReviews)
router.post('/theatre-reviews', authenticate, theatreController.createTheatreReview)

router.get('/:city/shows/:movieId', theatreController.listShowsByMovieIdAndCity) // Todo: Make this public route
router.get('/shows/:movieId', theatreController.listShowsByMovieId)

module.exports = router

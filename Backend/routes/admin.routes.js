const express = require('express')
const theatreController = require('../controllers/theatre.controller')
const movieController = require('../controllers/movie.controller')
const analyticsController = require('../controllers/analytics.controller')
const { restrictToRole } = require('../middlewares/auth.middleware')

const router = express.Router()

// Debug endpoint to check authentication status
router.get('/debug/auth', (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user,
    headers: {
      authorization: req.headers.authorization ? 'Present' : 'Missing'
    }
  })
})

router.use(restrictToRole('admin'))

// Analytics routes
router.get('/analytics/dashboard', analyticsController.getDashboardAnalytics)
router.get('/analytics/recent-bookings', analyticsController.getRecentBookings)
router.get('/analytics/top-movies', analyticsController.getTopMovies)
router.get('/analytics/monthly-revenue', analyticsController.getMonthlyRevenue)
router.get('/analytics/theatre-stats', analyticsController.getTheatreStats)
router.get('/analytics/platform-stats', analyticsController.getPlatformStats)

// Theatre
router.get('/theatres', theatreController.getAllTheatres)
router.get('/theatres/:id', theatreController.getTheatreById)
router.post('/theatres', theatreController.createTheatre)
router.patch('/theatres/:id')
router.delete('/theatres/:id')

// Theatre Halls
router.get(
  '/theatres/:theatreId/halls',
  theatreController.getTheatreHallsByTheatreId
)
router.post('/theatres/halls', theatreController.createTheatreHall)

// Theatre Halls Movie Mapping
router.post('/shows', theatreController.createShow)

// Movie
router.get('/movies/:id', movieController.getMovieById)
router.post('/movies', movieController.createMovie)
router.patch('/movies/:id')
router.delete('/movies/:id')

module.exports = router

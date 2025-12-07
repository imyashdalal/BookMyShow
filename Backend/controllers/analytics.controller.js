const Booking = require('../models/booking.model');
const Movie = require('../models/movies.model');
const Theatre = require('../models/theatre.model');
const User = require('../models/user.model');
const Show = require('../models/theatre-hall-movie-mapping');
const TheatreHall = require('../models/theatre-halls.model');

/**
 * Get dashboard analytics
 * Returns key metrics for admin dashboard
 */
async function getDashboardAnalytics(req, res) {
    try {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

        // Total bookings
        const totalBookings = await Booking.countDocuments();
        const lastMonthBookings = await Booking.countDocuments({
            createdAt: { $gte: lastMonth }
        });
        const twoMonthsAgoBookings = await Booking.countDocuments({
            createdAt: { $gte: twoMonthsAgo, $lt: lastMonth }
        });

        // Calculate booking growth
        const bookingGrowth = twoMonthsAgoBookings > 0 
            ? ((lastMonthBookings - twoMonthsAgoBookings) / twoMonthsAgoBookings * 100).toFixed(1)
            : 0;

        // Total revenue calculation
        const revenueAggregation = await Booking.aggregate([
            {
                $lookup: {
                    from: 'theatrehallmoviemappings',
                    localField: 'showId',
                    foreignField: '_id',
                    as: 'show'
                }
            },
            { $unwind: '$show' },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$show.price' }
                }
            }
        ]);

        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

        // Last month revenue
        const lastMonthRevenueAgg = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastMonth }
                }
            },
            {
                $lookup: {
                    from: 'theatrehallmoviemappings',
                    localField: 'showId',
                    foreignField: '_id',
                    as: 'show'
                }
            },
            { $unwind: '$show' },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$show.price' }
                }
            }
        ]);

        const lastMonthRevenue = lastMonthRevenueAgg.length > 0 ? lastMonthRevenueAgg[0].totalRevenue : 0;

        // Two months ago revenue
        const twoMonthsAgoRevenueAgg = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: twoMonthsAgo, $lt: lastMonth }
                }
            },
            {
                $lookup: {
                    from: 'theatrehallmoviemappings',
                    localField: 'showId',
                    foreignField: '_id',
                    as: 'show'
                }
            },
            { $unwind: '$show' },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$show.price' }
                }
            }
        ]);

        const twoMonthsAgoRevenue = twoMonthsAgoRevenueAgg.length > 0 ? twoMonthsAgoRevenueAgg[0].totalRevenue : 0;

        // Calculate revenue growth
        const revenueGrowth = twoMonthsAgoRevenue > 0
            ? ((lastMonthRevenue - twoMonthsAgoRevenue) / twoMonthsAgoRevenue * 100).toFixed(1)
            : 0;

        // Total movies, theatres, users
        const totalMovies = await Movie.countDocuments();
        const totalTheatres = await Theatre.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Active shows (shows with future dates)
        const activeShows = await Show.countDocuments({
            showDate: { $gte: now.toISOString().split('T')[0] }
        });

        res.status(200).json({
            totalBookings,
            totalRevenue,
            totalMovies,
            totalTheatres,
            totalUsers,
            activeShows,
            bookingGrowth: parseFloat(bookingGrowth),
            revenueGrowth: parseFloat(revenueGrowth)
        });
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
}

/**
 * Get recent bookings
 * Returns last N bookings with user and movie details
 */
async function getRecentBookings(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const bookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate({
                path: 'userId',
                select: 'firstname lastname email'
            })
            .populate({
                path: 'showId',
                populate: {
                    path: 'movieId',
                    select: 'title imageURL'
                }
            })
            .lean();

        const formattedBookings = bookings.map(booking => {
            const timeDiff = Date.now() - new Date(booking.createdAt).getTime();
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor(timeDiff / (1000 * 60));
            
            let timeAgo;
            if (hours > 0) {
                timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            }

            return {
                id: booking._id,
                movie: booking.showId?.movieId?.title || 'Unknown Movie',
                user: booking.userId 
                    ? `${booking.userId.firstname} ${booking.userId.lastname || ''}`.trim()
                    : 'Unknown User',
                amount: booking.showId?.price || 0,
                time: timeAgo,
                status: 'confirmed',
                createdAt: booking.createdAt
            };
        });

        res.status(200).json(formattedBookings);
    } catch (error) {
        console.error('Error fetching recent bookings:', error);
        res.status(500).json({ error: 'Failed to fetch recent bookings' });
    }
}

/**
 * Get top performing movies
 * Returns movies sorted by bookings and revenue
 */
async function getTopMovies(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const topMovies = await Booking.aggregate([
            {
                $lookup: {
                    from: 'theatrehallmoviemappings',
                    localField: 'showId',
                    foreignField: '_id',
                    as: 'show'
                }
            },
            { $unwind: '$show' },
            {
                $group: {
                    _id: '$show.movieId',
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$show.price' }
                }
            },
            {
                $lookup: {
                    from: 'movies',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'movie'
                }
            },
            { $unwind: '$movie' },
            {
                $project: {
                    id: '$_id',
                    title: '$movie.title',
                    bookings: 1,
                    revenue: 1,
                    rating: '$movie.averageRating'
                }
            },
            { $sort: { bookings: -1 } },
            { $limit: limit }
        ]);

        res.status(200).json(topMovies);
    } catch (error) {
        console.error('Error fetching top movies:', error);
        res.status(500).json({ error: 'Failed to fetch top movies' });
    }
}

/**
 * Get monthly revenue
 * Returns revenue for last 6 months
 */
async function getMonthlyRevenue(req, res) {
    try {
        const months = parseInt(req.query.months) || 6;
        const now = new Date();
        
        const monthlyData = [];
        
        for (let i = months - 1; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            
            const revenueAgg = await Booking.aggregate([
                {
                    $match: {
                        createdAt: { $gte: monthStart, $lte: monthEnd }
                    }
                },
                {
                    $lookup: {
                        from: 'theatrehallmoviemappings',
                        localField: 'showId',
                        foreignField: '_id',
                        as: 'show'
                    }
                },
                { $unwind: '$show' },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$show.price' }
                    }
                }
            ]);

            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            monthlyData.push({
                month: monthNames[monthStart.getMonth()],
                revenue: revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0
            });
        }

        res.status(200).json(monthlyData);
    } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        res.status(500).json({ error: 'Failed to fetch monthly revenue' });
    }
}

/**
 * Get theatre statistics
 * Returns statistics about theatres and their performance
 */
async function getTheatreStats(req, res) {
    try {
        const totalTheatres = await Theatre.countDocuments();
        const totalHalls = await TheatreHall.countDocuments();
        
        // Average halls per theatre
        const avgHallsPerTheatre = totalTheatres > 0 
            ? (totalHalls / totalTheatres).toFixed(1) 
            : 0;

        res.status(200).json({
            totalTheatres,
            totalHalls,
            avgHallsPerTheatre: parseFloat(avgHallsPerTheatre),
            utilizationRate: 85 // This could be calculated based on show schedules
        });
    } catch (error) {
        console.error('Error fetching theatre stats:', error);
        res.status(500).json({ error: 'Failed to fetch theatre statistics' });
    }
}

/**
 * Get platform statistics
 * Returns overall platform health metrics
 */
async function getPlatformStats(req, res) {
    try {
        // Calculate average rating from movies
        const avgRatingResult = await Movie.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$averageRating' }
                }
            }
        ]);

        const avgRating = avgRatingResult.length > 0 
            ? avgRatingResult[0].avgRating.toFixed(1) 
            : 0;

        // Calculate capacity utilization (movies with active shows / total movies)
        const moviesWithShows = await Show.distinct('movieId');
        const totalMovies = await Movie.countDocuments();
        const capacityUtilization = totalMovies > 0 
            ? ((moviesWithShows.length / totalMovies) * 100).toFixed(0)
            : 0;

        res.status(200).json({
            avgRating: parseFloat(avgRating),
            capacityUtilization: parseInt(capacityUtilization),
            satisfactionScore: Math.min(parseFloat(avgRating) / 5 * 100, 100).toFixed(0)
        });
    } catch (error) {
        console.error('Error fetching platform stats:', error);
        res.status(500).json({ error: 'Failed to fetch platform statistics' });
    }
}

module.exports = {
    getDashboardAnalytics,
    getRecentBookings,
    getTopMovies,
    getMonthlyRevenue,
    getTheatreStats,
    getPlatformStats
};

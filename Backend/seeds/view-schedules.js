/**
 * Utility script to query and display theatre show schedules
 * This helps visualize the seeded show data
 * 
 * Usage:
 *   node view-schedules.js [options]
 * 
 * Examples:
 *   node view-schedules.js --theatre "PVR INOX Forum Mall" --date "2025-10-26"
 *   node view-schedules.js --movie "Inception" --city "Bangalore"
 *   node view-schedules.js --city "Mumbai" --date "2025-10-26"
 */

require('dotenv').config();
const mongoose = require('mongoose');

const TheatreHallMovieMapping = require('../models/theatre-hall-movie-mapping');
const Theatre = require('../models/theatre.model');
const TheatreHall = require('../models/theatre-halls.model');
const Movie = require('../models/movies.model');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i += 2) {
  if (args[i].startsWith('--')) {
    options[args[i].substring(2)] = args[i + 1];
  }
}

/**
 * Format time for display
 */
const formatTime = (time) => {
  return time;
};

/**
 * Draw a box around text
 */
const drawBox = (title, width = 80) => {
  const line = '═'.repeat(width - 2);
  console.log(`╔${line}╗`);
  const padding = Math.floor((width - title.length - 2) / 2);
  const paddedTitle = ' '.repeat(padding) + title + ' '.repeat(width - title.length - padding - 2);
  console.log(`║${paddedTitle}║`);
  console.log(`╚${line}╝`);
};

/**
 * Display shows for a specific theatre on a specific date
 */
const displayTheatreSchedule = async (theatreName, date) => {
  try {
    // Find theatre
    const theatre = await Theatre.findOne({ name: theatreName });
    if (!theatre) {
      console.log(`❌ Theatre not found: ${theatreName}`);
      return;
    }

    // Find halls for this theatre
    const halls = await TheatreHall.find({ theatreId: theatre._id }).sort({ number: 1 });
    
    drawBox(`${theatreName} - ${date}`, 80);
    console.log(`📍 ${theatre.street}, ${theatre.city}`);
    console.log(`⭐ Rating: ${theatre.averageRating}/5 (${theatre.totalReviews} reviews)`);
    console.log();

    // Get shows for each hall
    for (const hall of halls) {
      const shows = await TheatreHallMovieMapping
        .find({ theatreHallId: hall._id, showDate: date })
        .populate('movieId')
        .sort({ startTimestamp: 1 });

      if (shows.length === 0) continue;

      console.log(`\n${'━'.repeat(80)}`);
      console.log(`🎬 HALL ${hall.number} (Capacity: ${hall.seatingCapacity})`);
      console.log(`${'━'.repeat(80)}`);

      shows.forEach((show, index) => {
        const duration = show.movieId.durationInMinutes;
        console.log(
          `${(index + 1).toString().padStart(2)}. ` +
          `${show.startTimestamp} - ${show.endTimestamp} │ ` +
          `${show.movieId.title.padEnd(35)} │ ` +
          `${duration} min │ ` +
          `₹${show.price}`
        );
      });
    }

    console.log(`\n${'═'.repeat(80)}\n`);
  } catch (error) {
    console.error('Error displaying theatre schedule:', error);
  }
};

/**
 * Display all shows for a specific movie
 */
const displayMovieShows = async (movieTitle, city = null) => {
  try {
    // Find movie
    const movie = await Movie.findOne({ title: movieTitle });
    if (!movie) {
      console.log(`❌ Movie not found: ${movieTitle}`);
      return;
    }

    drawBox(`${movieTitle} - Show Times`, 80);
    console.log(`🎬 ${movie.language} | ${movie.genre.join(', ')}`);
    console.log(`⏱️  Duration: ${movie.durationInMinutes} minutes`);
    console.log(`⭐ Rating: ${movie.averageRating}/5 (${movie.totalReviews} reviews)`);
    console.log();

    // Build query
    const query = { movieId: movie._id };
    if (city) {
      query.city = city;
    }

    // Get all shows
    const shows = await TheatreHallMovieMapping
      .find(query)
      .populate('theatreHallId')
      .sort({ showDate: 1, startTimestamp: 1 });

    if (shows.length === 0) {
      console.log('❌ No shows found for this movie');
      return;
    }

    // Group by date
    const showsByDate = shows.reduce((acc, show) => {
      if (!acc[show.showDate]) {
        acc[show.showDate] = [];
      }
      acc[show.showDate].push(show);
      return acc;
    }, {});

    // Display by date
    for (const [date, dateShows] of Object.entries(showsByDate).sort()) {
      console.log(`\n📅 ${date}`);
      console.log(`${'─'.repeat(80)}`);

      // Get unique theatres for this date
      const theatreHallIds = [...new Set(dateShows.map(s => s.theatreHallId._id.toString()))];
      
      for (const hallId of theatreHallIds) {
        const hallShows = dateShows.filter(s => s.theatreHallId._id.toString() === hallId);
        const hall = hallShows[0].theatreHallId;
        
        // Get theatre info
        const theatre = await Theatre.findById(hall.theatreId);
        
        hallShows.forEach(show => {
          console.log(
            `   ${show.startTimestamp} - ${show.endTimestamp} │ ` +
            `${theatre.name.padEnd(30)} │ ` +
            `Hall ${hall.number} │ ` +
            `₹${show.price}`
          );
        });
      }
    }

    console.log(`\n${'═'.repeat(80)}`);
    console.log(`📊 Total Shows: ${shows.length}`);
    console.log(`📅 Dates: ${Object.keys(showsByDate).length} days`);
    console.log(`${'═'.repeat(80)}\n`);
  } catch (error) {
    console.error('Error displaying movie shows:', error);
  }
};

/**
 * Display all shows for a city on a specific date
 */
const displayCityShows = async (city, date) => {
  try {
    drawBox(`${city} - ${date}`, 80);

    // Get all shows for this city and date
    const shows = await TheatreHallMovieMapping
      .find({ city, showDate: date })
      .populate('movieId')
      .populate('theatreHallId')
      .sort({ startTimestamp: 1 });

    if (shows.length === 0) {
      console.log(`❌ No shows found for ${city} on ${date}`);
      return;
    }

    // Group by movie
    const showsByMovie = shows.reduce((acc, show) => {
      const movieTitle = show.movieId.title;
      if (!acc[movieTitle]) {
        acc[movieTitle] = [];
      }
      acc[movieTitle].push(show);
      return acc;
    }, {});

    // Display by movie
    for (const [movieTitle, movieShows] of Object.entries(showsByMovie).sort()) {
      console.log(`\n🎬 ${movieTitle} (${movieShows.length} shows)`);
      console.log(`${'─'.repeat(80)}`);

      movieShows.slice(0, 10).forEach(show => {
        // Get theatre info
        TheatreHall.findById(show.theatreHallId._id)
          .populate('theatreId')
          .then(hall => {
            Theatre.findById(hall.theatreId).then(theatre => {
              console.log(
                `   ${show.startTimestamp} - ${show.endTimestamp} │ ` +
                `${theatre.name.padEnd(30)} │ ` +
                `Hall ${hall.number} │ ` +
                `₹${show.price}`
              );
            });
          });
      });

      if (movieShows.length > 10) {
        console.log(`   ... and ${movieShows.length - 10} more shows`);
      }
    }

    console.log(`\n${'═'.repeat(80)}`);
    console.log(`📊 Total Shows: ${shows.length}`);
    console.log(`🎬 Movies: ${Object.keys(showsByMovie).length}`);
    console.log(`${'═'.repeat(80)}\n`);
  } catch (error) {
    console.error('Error displaying city shows:', error);
  }
};

/**
 * Display statistics
 */
const displayStatistics = async () => {
  try {
    drawBox('SHOW SCHEDULE STATISTICS', 80);

    // Total shows
    const totalShows = await TheatreHallMovieMapping.countDocuments();
    console.log(`\n📊 Total Shows: ${totalShows}`);

    // Shows by date
    const showsByDate = await TheatreHallMovieMapping.aggregate([
      { $group: { _id: '$showDate', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📅 Shows by Date:');
    showsByDate.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} shows`);
    });

    // Shows by city
    const showsByCity = await TheatreHallMovieMapping.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n🏙️  Shows by City:');
    showsByCity.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} shows`);
    });

    // Price statistics
    const priceStats = await TheatreHallMovieMapping.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    if (priceStats.length > 0) {
      console.log('\n💰 Price Statistics:');
      console.log(`   Average: ₹${Math.round(priceStats[0].avgPrice)}`);
      console.log(`   Minimum: ₹${priceStats[0].minPrice}`);
      console.log(`   Maximum: ₹${priceStats[0].maxPrice}`);
    }

    // Top movies by show count
    const topMovies = await TheatreHallMovieMapping.aggregate([
      { $group: { _id: '$movieId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    console.log('\n🎬 Top 5 Movies by Show Count:');
    for (const { _id, count } of topMovies) {
      const movie = await Movie.findById(_id);
      if (movie) {
        console.log(`   ${movie.title}: ${count} shows`);
      }
    }

    console.log(`\n${'═'.repeat(80)}\n`);
  } catch (error) {
    console.error('Error displaying statistics:', error);
  }
};

/**
 * Main function
 */
const main = async () => {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking-app';
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB\n');

    // Process based on options
    if (options.theatre && options.date) {
      await displayTheatreSchedule(options.theatre, options.date);
    } else if (options.movie) {
      await displayMovieShows(options.movie, options.city);
    } else if (options.city && options.date) {
      await displayCityShows(options.city, options.date);
    } else if (options.stats || Object.keys(options).length === 0) {
      await displayStatistics();
    } else {
      console.log('Usage:');
      console.log('  node view-schedules.js --theatre "Theatre Name" --date "YYYY-MM-DD"');
      console.log('  node view-schedules.js --movie "Movie Title" [--city "City Name"]');
      console.log('  node view-schedules.js --city "City Name" --date "YYYY-MM-DD"');
      console.log('  node view-schedules.js --stats');
      console.log('\nExamples:');
      console.log('  node view-schedules.js --theatre "PVR INOX Forum Mall" --date "2025-10-26"');
      console.log('  node view-schedules.js --movie "Inception" --city "Bangalore"');
      console.log('  node view-schedules.js --city "Mumbai" --date "2025-10-26"');
      console.log('  node view-schedules.js --stats');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
main();

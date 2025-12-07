// Seed data for Theatre Hall Movie Mapping
// This seed generates show schedules for all theatres across the next 7 days
// Each theatre has different start times, and shows are scheduled to maximize capacity
// Theatres with 4+ halls can show all 20 movies, others prioritize by ratings

/**
 * Configuration for different theatre start times
 * No theatre starts after 12:30 PM
 */
const theatreStartTimes = {
  "PVR INOX Forum Mall": { hour: 9, minute: 30 },
  "Cinépolis Royal Meenakshi Mall": { hour: 8, minute: 0 },
  "INOX Garuda Mall": { hour: 10, minute: 0 },
  "PVR Orion Mall": { hour: 7, minute: 30 },
  "Cinépolis Nexus Shantiniketan": { hour: 11, minute: 0 },
  "PVR Phoenix Palladium": { hour: 8, minute: 30 },
  "INOX R-City Mall": { hour: 9, minute: 0 },
  "Cinépolis Seawoods Grand Central": { hour: 10, minute: 30 },
  "PVR INOX Juhu": { hour: 12, minute: 0 },
  "Cinépolis Viviana Mall": { hour: 7, minute: 30 },
  "INOX Nariman Point": { hour: 11, minute: 30 },
  "PVR Emporia Mall": { hour: 9, minute: 30 },
  "Cinépolis City One Mall": { hour: 8, minute: 30 },
  "INOX Jaswant Tuli Mall": { hour: 10, minute: 30 },
  "Cinépolis VR Nagpur": { hour: 9, minute: 0 },
  "PVR Select Citywalk": { hour: 8, minute: 0 },
  "PVR Priya Vasant Vihar": { hour: 10, minute: 0 },
  "INOX Nehru Place": { hour: 11, minute: 0 },
  "Cinépolis DLF Place": { hour: 9, minute: 30 },
  "PVR Rivoli Connaught Place": { hour: 12, minute: 30 },
  "INOX Sapphire 83": { hour: 10, minute: 30 },
};

/**
 * Theatre hall counts (from theatre-hall.seed.js)
 */
const theatreHallCounts = {
  "PVR INOX Forum Mall": 5,
  "Cinépolis Royal Meenakshi Mall": 7,
  "INOX Garuda Mall": 4,
  "PVR Orion Mall": 6,
  "Cinépolis Nexus Shantiniketan": 3,
  "PVR Phoenix Palladium": 8,
  "INOX R-City Mall": 5,
  "Cinépolis Seawoods Grand Central": 6,
  "PVR INOX Juhu": 4,
  "Cinépolis Viviana Mall": 7,
  "INOX Nariman Point": 3,
  "PVR Emporia Mall": 4,
  "Cinépolis City One Mall": 5,
  "INOX Jaswant Tuli Mall": 3,
  "Cinépolis VR Nagpur": 6,
  "PVR Select Citywalk": 7,
  "PVR Priya Vasant Vihar": 3,
  "INOX Nehru Place": 4,
  "Cinépolis DLF Place": 6,
  "PVR Rivoli Connaught Place": 2,
  "INOX Sapphire 83": 5,
};

/**
 * Theatre cities mapping
 */
const theatreCities = {
  "PVR INOX Forum Mall": "Bangalore",
  "Cinépolis Royal Meenakshi Mall": "Bangalore",
  "INOX Garuda Mall": "Bangalore",
  "PVR Orion Mall": "Bangalore",
  "Cinépolis Nexus Shantiniketan": "Bangalore",
  "PVR Phoenix Palladium": "Mumbai",
  "INOX R-City Mall": "Mumbai",
  "Cinépolis Seawoods Grand Central": "Mumbai",
  "PVR INOX Juhu": "Mumbai",
  "Cinépolis Viviana Mall": "Mumbai",
  "INOX Nariman Point": "Mumbai",
  "PVR Emporia Mall": "Nagpur",
  "Cinépolis City One Mall": "Nagpur",
  "INOX Jaswant Tuli Mall": "Nagpur",
  "Cinépolis VR Nagpur": "Nagpur",
  "PVR Select Citywalk": "Delhi",
  "PVR Priya Vasant Vihar": "Delhi",
  "INOX Nehru Place": "Delhi",
  "Cinépolis DLF Place": "Delhi",
  "PVR Rivoli Connaught Place": "Delhi",
  "INOX Sapphire 83": "Delhi",
};

/**
 * Movie data with ratings (sorted by rating for prioritization)
 * Using averageRating from movie.seed.js
 */
const moviesWithRatings = [
  { title: "The Dark Knight", duration: 152, rating: 4.9 },
  { title: "The Shawshank Redemption", duration: 142, rating: 4.9 },
  { title: "3 Idiots", duration: 170, rating: 4.9 },
  { title: "Inception", duration: 148, rating: 4.8 },
  { title: "Interstellar", duration: 169, rating: 4.8 },
  { title: "Dangal", duration: 161, rating: 4.8 },
  { title: "Spider-Man: Across the Spider-Verse", duration: 140, rating: 4.7 },
  { title: "Parasite", duration: 132, rating: 4.7 },
  { title: "The Lion King", duration: 118, rating: 4.7 },
  { title: "Avatar: The Way of Water", duration: 192, rating: 4.6 },
  { title: "Toy Story 4", duration: 100, rating: 4.6 },
  { title: "Oppenheimer", duration: 180, rating: 4.5 },
  { title: "La La Land", duration: 128, rating: 4.5 },
  { title: "John Wick: Chapter 4", duration: 169, rating: 4.5 },
  { title: "Dune", duration: 155, rating: 4.5 },
  { title: "Guardians of the Galaxy Vol. 3", duration: 150, rating: 4.4 },
  { title: "The Conjuring", duration: 112, rating: 4.4 },
  { title: "Jawan", duration: 169, rating: 4.3 },
  { title: "Barbie", duration: 114, rating: 4.2 },
  { title: "Pathaan", duration: 146, rating: 4.1 },
];

/**
 * Price tiers based on hall capacity and theatre type
 */
const getPriceForShow = (theatreName, hallNumber, seatingCapacity) => {
  // Premium theatres
  const premiumTheatres = [
    "PVR Phoenix Palladium",
    "PVR Select Citywalk",
    "Cinépolis DLF Place",
  ];

  // Base price calculation
  let basePrice = 150;

  if (premiumTheatres.includes(theatreName)) {
    basePrice = 250;
  } else if (seatingCapacity > 300) {
    basePrice = 220;
  } else if (seatingCapacity > 200) {
    basePrice = 180;
  }

  // Add variation based on hall number (lower numbers are often better halls)
  const hallPriceModifier = Math.max(0, (5 - hallNumber) * 10);

  return basePrice + hallPriceModifier;
};

/**
 * Utility function to format time as HH:MM
 */
const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Utility function to format date as YYYY-MM-DD
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Generate shows for a single hall on a single day
 * @param {string} theatreName - Name of the theatre
 * @param {number} hallNumber - Hall number
 * @param {Date} date - Date for the shows
 * @param {Array} movies - Movies to schedule (already prioritized)
 * @param {number} seatingCapacity - Seating capacity of the hall
 * @returns {Array} Array of show mappings
 */
const generateShowsForHallOnDay = (
  theatreName,
  hallNumber,
  date,
  movies,
  seatingCapacity
) => {
  const shows = [];
  const startTime = theatreStartTimes[theatreName];
  const city = theatreCities[theatreName];

  // Create a date object for the first show
  const currentShowTime = new Date(date);
  currentShowTime.setHours(startTime.hour, startTime.minute, 0, 0);

  // End time for last show (no show should start after 11:00 PM)
  const lastShowStartTime = new Date(date);
  lastShowStartTime.setHours(23, 0, 0, 0);

  let movieIndex = 0;

  // Schedule shows throughout the day
  while (currentShowTime < lastShowStartTime && movieIndex < movies.length) {
    const movie = movies[movieIndex];
    const movieDuration = movie.duration;
    const cleanupTime = 20; // 20 minutes between shows

    // Calculate end time
    const endTime = new Date(currentShowTime);
    endTime.setMinutes(endTime.getMinutes() + movieDuration);

    // Check if this show would end too late (after 2:30 AM next day)
    const maxEndTime = new Date(date);
    maxEndTime.setDate(maxEndTime.getDate() + 1);
    maxEndTime.setHours(2, 30, 0, 0);

    if (endTime > maxEndTime) {
      break; // Don't schedule this show
    }

    // Create show mapping object
    const showMapping = {
      movieRef: movie.title,
      theatreRef: theatreName,
      hallNumber: hallNumber,
      showDate: formatDate(date),
      startTimestamp: formatTime(currentShowTime),
      endTimestamp: formatTime(endTime),
      price: getPriceForShow(theatreName, hallNumber, seatingCapacity),
      city: city,
    };

    shows.push(showMapping);

    // Move to next show time (movie duration + cleanup time)
    currentShowTime.setMinutes(
      currentShowTime.getMinutes() + movieDuration + cleanupTime
    );

    // Move to next movie in rotation
    movieIndex = (movieIndex + 1) % movies.length;
  }

  return shows;
};

/**
 * Select movies for a theatre based on hall count
 * Theatres with 4+ halls show all 20 movies
 * Theatres with fewer halls prioritize by rating and show at least 5 movies
 * @param {number} hallCount - Number of halls in the theatre
 * @returns {Array} Selected movies for this theatre
 */
const selectMoviesForTheatre = (hallCount) => {
  if (hallCount >= 5) {
    // Show all movies
    return [...moviesWithRatings];
  } else if (hallCount === 4) {
    // Show top 15 movies
    return moviesWithRatings.slice(0, 15);
  } else if (hallCount === 3) {
    // Show top 10 movies
    return moviesWithRatings.slice(0, 10);
  } else {
    // Show at least top 5 movies
    return moviesWithRatings.slice(0, Math.max(5, hallCount * 2));
  }
};

/**
 * Generate seating capacities for theatre halls
 * This is a simplified version - in real implementation, this would come from DB
 */
const getHallCapacity = (theatreName, hallNumber) => {
  // Larger halls typically have higher capacity
  const baseCapacity = 150;
  const capacityIncrement = 50;
  const hallCount = theatreHallCounts[theatreName];

  // Hall 1 is usually the largest
  return baseCapacity + (hallCount - hallNumber) * capacityIncrement;
};

/**
 * Distribute movies across halls to avoid repetition on the same day
 * @param {Array} movies - Available movies
 * @param {number} hallCount - Number of halls
 * @returns {Object} Map of hall number to movie array
 */
const distributeMoviesAcrossHalls = (movies, hallCount) => {
  const hallMovies = {};

  for (let hall = 1; hall <= hallCount; hall++) {
    // Rotate movies so each hall starts with a different movie
    const offset = (hall - 1) * Math.floor(movies.length / hallCount);
    hallMovies[hall] = [
      ...movies.slice(offset),
      ...movies.slice(0, offset),
    ];
  }

  return hallMovies;
};

/**
 * Generate all show mappings for all theatres over 7 days
 * @returns {Array} Array of all show mappings
 */
const generateTheatreHallMovieMappings = () => {
  const allMappings = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day

  // Iterate through each theatre
  Object.keys(theatreStartTimes).forEach((theatreName) => {
    const hallCount = theatreHallCounts[theatreName];
    const selectedMovies = selectMoviesForTheatre(hallCount);
    const hallMovieDistribution = distributeMoviesAcrossHalls(
      selectedMovies,
      hallCount
    );

    console.log(
      `Generating shows for ${theatreName} (${hallCount} halls, ${selectedMovies.length} movies)`
    );

    // Generate shows for next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + dayOffset);

      // Generate shows for each hall
      for (let hallNumber = 1; hallNumber <= hallCount; hallNumber++) {
        const hallCapacity = getHallCapacity(theatreName, hallNumber);
        const hallMovies = hallMovieDistribution[hallNumber];

        const hallShows = generateShowsForHallOnDay(
          theatreName,
          hallNumber,
          currentDate,
          hallMovies,
          hallCapacity
        );

        allMappings.push(...hallShows);
      }
    }
  });

  return allMappings;
};

/**
 * Main function to generate seed data
 * This will be called when seeding the database
 */
const generateSeedData = () => {
  console.log("Starting theatre-hall-movie mapping seed generation...");
  const mappings = generateTheatreHallMovieMappings();
  console.log(`Generated ${mappings.length} show mappings`);

  // Group by date for statistics
  const byDate = mappings.reduce((acc, mapping) => {
    if (!acc[mapping.showDate]) {
      acc[mapping.showDate] = [];
    }
    acc[mapping.showDate].push(mapping);
    return acc;
  }, {});

  console.log("\nShows per day:");
  Object.keys(byDate)
    .sort()
    .forEach((date) => {
      console.log(`  ${date}: ${byDate[date].length} shows`);
    });

  // Group by theatre for statistics
  const byTheatre = mappings.reduce((acc, mapping) => {
    if (!acc[mapping.theatreRef]) {
      acc[mapping.theatreRef] = [];
    }
    acc[mapping.theatreRef].push(mapping);
    return acc;
  }, {});

  console.log("\nShows per theatre (7 days):");
  Object.keys(byTheatre).forEach((theatre) => {
    console.log(`  ${theatre}: ${byTheatre[theatre].length} shows`);
  });

  return mappings;
};

/**
 * Function to insert seed data into MongoDB
 * To be used when actual database seeding is needed
 * 
 * Usage:
 * const TheatreHallMovieMapping = require('../models/theatre-hall-movie-mapping');
 * const Theatre = require('../models/theatre.model');
 * const TheatreHall = require('../models/theatre-halls.model');
 * const Movie = require('../models/movies.model');
 * 
 * await seedTheatreHallMovieMappings();
 */
const seedTheatreHallMovieMappings = async () => {
  try {
    const mongoose = require("mongoose");
    const TheatreHallMovieMapping = require("../models/theatre-hall-movie-mapping");
    const Theatre = require("../models/theatre.model");
    const TheatreHall = require("../models/theatre-halls.model");
    const Movie = require("../models/movies.model");

    // Clear existing mappings
    try {
      await mongoose.connection.collection('theatrehallmoviemappings').drop();
      console.log("Dropped theatre hall movie mappings collection");
    } catch (err) {
      if (err.code === 26) {
        console.log("Collection doesn't exist yet, will create new");
      } else {
        throw err;
      }
    }

    // Generate seed data
    const mappings = generateSeedData();

    // Fetch all theatres, halls, and movies from DB
    const theatres = await Theatre.find({});
    const theatreHalls = await TheatreHall.find({}).populate("theatreId");
    const movies = await Movie.find({});

    // Create lookup maps
    const theatreMap = new Map(
      theatres.map((t) => [t.name, t._id])
    );
    const movieMap = new Map(
      movies.map((m) => [m.title, m._id])
    );

    // Create a map for theatre halls: "theatreName-hallNumber" -> hallId
    const hallMap = new Map();
    theatreHalls.forEach((hall) => {
      const key = `${hall.theatreId.name}-${hall.number}`;
      hallMap.set(key, hall._id);
    });

    // Transform mappings to include ObjectIds
    const mappingsWithIds = [];
    let skippedCount = 0;

    for (const mapping of mappings) {
      const theatreId = theatreMap.get(mapping.theatreRef);
      const movieId = movieMap.get(mapping.movieRef);
      const hallKey = `${mapping.theatreRef}-${mapping.hallNumber}`;
      const hallId = hallMap.get(hallKey);

      if (!theatreId || !movieId || !hallId) {
        console.warn(
          `Skipping mapping: Theatre="${mapping.theatreRef}", Movie="${mapping.movieRef}", Hall=${mapping.hallNumber} - Missing reference`
        );
        skippedCount++;
        continue;
      }

      mappingsWithIds.push({
        movieId: movieId,
        theatreHallId: hallId,
        showDate: mapping.showDate,
        startTimestamp: mapping.startTimestamp,
        endTimestamp: mapping.endTimestamp,
        price: mapping.price,
        city: mapping.city,
      });
    }

    // Insert mappings in batches to avoid memory issues
    const batchSize = 500;
    let insertedCount = 0;

    for (let i = 0; i < mappingsWithIds.length; i += batchSize) {
      const batch = mappingsWithIds.slice(i, i + batchSize);
      try {
        await TheatreHallMovieMapping.insertMany(batch, { ordered: false });
        insertedCount += batch.length;
      } catch (error) {
        // If it's a duplicate key error, count successful inserts
        if (error.code === 11000 && error.result) {
          insertedCount += error.result.insertedCount || 0;
          console.log(`Batch had ${batch.length - (error.result.insertedCount || 0)} duplicates, inserted ${error.result.insertedCount || 0}`);
        } else {
          throw error;
        }
      }
      console.log(`Progress: ${insertedCount}/${mappingsWithIds.length}`);
    }

    console.log(
      `\n✅ Successfully seeded ${insertedCount} theatre hall movie mappings`
    );
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} mappings due to missing references`);
    }

    return {
      inserted: insertedCount,
      skipped: skippedCount,
      total: mappings.length,
    };
  } catch (error) {
    console.error("Error seeding theatre hall movie mappings:", error);
    throw error;
  }
};

// Export both the raw seed data and the seeding function
module.exports = {
  generateSeedData,
  seedTheatreHallMovieMappings,
  theatreHallMovieMappingSeedData: generateSeedData(),
};

// If running directly (for testing)
if (require.main === module) {
  console.log("=== Theatre Hall Movie Mapping Seed Data Generator ===\n");
  const seedData = generateSeedData();
  
  console.log("\n=== Sample Mappings ===");
  console.log("\nFirst 5 mappings:");
  seedData.slice(0, 5).forEach((mapping, index) => {
    console.log(`\n${index + 1}.`);
    console.log(`   Theatre: ${mapping.theatreRef} (Hall ${mapping.hallNumber})`);
    console.log(`   Movie: ${mapping.movieRef}`);
    console.log(`   Date: ${mapping.showDate}`);
    console.log(`   Time: ${mapping.startTimestamp} - ${mapping.endTimestamp}`);
    console.log(`   Price: ₹${mapping.price}`);
    console.log(`   City: ${mapping.city}`);
  });

  console.log("\n=== Summary ===");
  console.log(`Total show mappings generated: ${seedData.length}`);
  
  // Validate no overlapping times for same hall on same day
  const validationMap = new Map();
  let overlaps = 0;
  
  seedData.forEach((show) => {
    const key = `${show.theatreRef}-${show.hallNumber}-${show.showDate}`;
    if (!validationMap.has(key)) {
      validationMap.set(key, []);
    }
    
    const existingShows = validationMap.get(key);
    const [startHour, startMin] = show.startTimestamp.split(':').map(Number);
    const [endHour, endMin] = show.endTimestamp.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle next day end times
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    // Check for overlaps
    for (const existing of existingShows) {
      if (
        (startMinutes >= existing.start && startMinutes < existing.end) ||
        (endMinutes > existing.start && endMinutes <= existing.end) ||
        (startMinutes <= existing.start && endMinutes >= existing.end)
      ) {
        overlaps++;
        console.warn(
          `Overlap detected: ${show.theatreRef} Hall ${show.hallNumber} on ${show.showDate}`
        );
      }
    }
    
    existingShows.push({ start: startMinutes, end: endMinutes });
  });
  
  if (overlaps === 0) {
    console.log("✅ No overlapping show times detected!");
  } else {
    console.log(`⚠️  ${overlaps} overlapping show times detected`);
  }
}

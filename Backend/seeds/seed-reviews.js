// Master seed script to populate all review data
// Run this script to seed theatre reviews, critic reviews, and movie reviews

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Theatre = require('../models/theatre.model');
const Movie = require('../models/movies.model');
const User = require('../models/user.model');
const TheatreReview = require('../models/theatre-review.model');
const CriticReview = require('../models/critic-review.model');
const MovieReview = require('../models/movie-review.model');

// Import seed data generators
const { generateTheatreReviews } = require('./theatre-review.seed');
const { generateCriticReviews } = require('./critic-review.seed');
const { generateMovieReviews } = require('./movie-review.seed');

async function seedReviews() {
  try {
    console.log('🌱 Starting review seeding process...\n');

    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking-app';
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB\n');

    // Fetch all necessary IDs
    console.log('📊 Fetching existing data...');
    const theatres = await Theatre.find({}).select('_id name');
    const movies = await Movie.find({}).select('_id title');
    const users = await User.find({ role: 'user' }).select('_id email');

    console.log(`   Found ${theatres.length} theatres`);
    console.log(`   Found ${movies.length} movies`);
    console.log(`   Found ${users.length} users\n`);

    if (theatres.length === 0 || movies.length === 0 || users.length === 0) {
      console.log('⚠️  Warning: Please seed theatres, movies, and users first!');
      process.exit(1);
    }

    const theatreIds = theatres.map(t => t._id);
    const movieIds = movies.map(m => m._id);
    const userIds = users.map(u => u._id);

    // Clear existing reviews (optional - comment out if you want to keep existing reviews)
    console.log('🗑️  Clearing existing reviews...');
    await TheatreReview.deleteMany({});
    await CriticReview.deleteMany({});
    await MovieReview.deleteMany({});
    console.log('   Existing reviews cleared\n');

    // Generate Theatre Reviews
    console.log('🎭 Generating theatre reviews...');
    const theatreReviews = generateTheatreReviews(theatreIds, userIds);
    console.log(`   Generated ${theatreReviews.length} theatre reviews`);
    
    // Insert theatre reviews in batches
    const theatreReviewBatches = [];
    for (let i = 0; i < theatreReviews.length; i += 100) {
      theatreReviewBatches.push(theatreReviews.slice(i, i + 100));
    }
    
    for (let i = 0; i < theatreReviewBatches.length; i++) {
      await TheatreReview.insertMany(theatreReviewBatches[i]);
      console.log(`   Inserted batch ${i + 1}/${theatreReviewBatches.length}`);
    }
    console.log('✅ Theatre reviews seeded successfully!\n');

    // Generate Critic Reviews
    console.log('🎬 Generating critic reviews...');
    const criticReviews = generateCriticReviews(movieIds);
    console.log(`   Generated ${criticReviews.length} critic reviews`);
    
    // Insert critic reviews in batches
    const criticReviewBatches = [];
    for (let i = 0; i < criticReviews.length; i += 100) {
      criticReviewBatches.push(criticReviews.slice(i, i + 100));
    }
    
    for (let i = 0; i < criticReviewBatches.length; i++) {
      await CriticReview.insertMany(criticReviewBatches[i]);
      console.log(`   Inserted batch ${i + 1}/${criticReviewBatches.length}`);
    }
    console.log('✅ Critic reviews seeded successfully!\n');

    // Generate Movie Reviews (User Reviews)
    console.log('🎥 Generating movie user reviews...');
    const movieReviews = generateMovieReviews(movieIds, userIds);
    console.log(`   Generated ${movieReviews.length} movie user reviews`);
    
    // Insert movie reviews in batches
    const movieReviewBatches = [];
    for (let i = 0; i < movieReviews.length; i += 100) {
      movieReviewBatches.push(movieReviews.slice(i, i + 100));
    }
    
    for (let i = 0; i < movieReviewBatches.length; i++) {
      await MovieReview.insertMany(movieReviewBatches[i]);
      console.log(`   Inserted batch ${i + 1}/${movieReviewBatches.length}`);
    }
    console.log('✅ Movie user reviews seeded successfully!\n');

    // Update theatre statistics
    console.log('📈 Updating theatre statistics...');
    for (const theatre of theatres) {
      const reviews = await TheatreReview.find({ theatreId: theatre._id });
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await Theatre.findByIdAndUpdate(theatre._id, {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
        });
      }
    }
    console.log('✅ Theatre statistics updated!\n');

    // Update movie statistics
    console.log('📈 Updating movie statistics...');
    for (const movie of movies) {
      const userReviews = await MovieReview.find({ movieId: movie._id });
      const criticReviews = await CriticReview.find({ movieId: movie._id });
      
      if (userReviews.length > 0) {
        const totalRating = userReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / userReviews.length;
        
        const updateData = {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: userReviews.length,
        };
        
        if (criticReviews.length > 0) {
          const totalCriticRating = criticReviews.reduce((sum, r) => sum + r.rating, 0);
          updateData.criticRating = Math.round((totalCriticRating / criticReviews.length) * 10) / 10;
        }
        
        await Movie.findByIdAndUpdate(movie._id, updateData);
      }
    }
    console.log('✅ Movie statistics updated!\n');

    // Display summary
    console.log('📊 SEEDING SUMMARY');
    console.log('==================');
    console.log(`Theatre Reviews: ${theatreReviews.length}`);
    console.log(`Critic Reviews: ${criticReviews.length}`);
    console.log(`Movie User Reviews: ${movieReviews.length}`);
    console.log(`Total Reviews: ${theatreReviews.length + criticReviews.length + movieReviews.length}`);
    console.log('\n🎉 All reviews seeded successfully!');

    // Verify the data
    console.log('\n🔍 Verification:');
    for (const theatre of theatres.slice(0, 3)) {
      const count = await TheatreReview.countDocuments({ theatreId: theatre._id });
      console.log(`   ${theatre.name}: ${count} reviews`);
    }
    
    for (const movie of movies.slice(0, 3)) {
      const userCount = await MovieReview.countDocuments({ movieId: movie._id });
      const criticCount = await CriticReview.countDocuments({ movieId: movie._id });
      console.log(`   ${movie.title}: ${userCount} user reviews, ${criticCount} critic reviews`);
    }

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedReviews();

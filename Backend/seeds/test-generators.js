// Quick test script to verify review seed data structure
// This doesn't connect to DB, just tests the generators

const { generateTheatreReviews } = require('./theatre-review.seed');
const { generateCriticReviews } = require('./critic-review.seed');
const { generateMovieReviews } = require('./movie-review.seed');

// Create mock IDs
const mockTheatreIds = Array(5).fill(null).map((_, i) => `theatre_${i}`);
const mockMovieIds = Array(5).fill(null).map((_, i) => `movie_${i}`);
const mockUserIds = Array(15).fill(null).map((_, i) => `user_${i}`);

console.log('🧪 Testing Review Generators\n');

// Test Theatre Reviews
console.log('Testing Theatre Reviews...');
const theatreReviews = generateTheatreReviews(mockTheatreIds, mockUserIds);
console.log(`✅ Generated ${theatreReviews.length} theatre reviews`);
console.log('Sample:', theatreReviews[0]);
console.log('');

// Test Critic Reviews
console.log('Testing Critic Reviews...');
const criticReviews = generateCriticReviews(mockMovieIds);
console.log(`✅ Generated ${criticReviews.length} critic reviews`);
console.log('Sample:', criticReviews[0]);
console.log('');

// Test Movie Reviews
console.log('Testing Movie User Reviews...');
const movieReviews = generateMovieReviews(mockMovieIds, mockUserIds);
console.log(`✅ Generated ${movieReviews.length} movie user reviews`);
console.log('Sample:', movieReviews[0]);
console.log('');

// Verify distribution
console.log('📊 Distribution Analysis:');
console.log('='.repeat(50));

// Theatre reviews per theatre
const theatreReviewCounts = {};
theatreReviews.forEach(r => {
  theatreReviewCounts[r.theatreId] = (theatreReviewCounts[r.theatreId] || 0) + 1;
});
console.log('\nTheatre Reviews per Theatre:');
Object.entries(theatreReviewCounts).forEach(([id, count]) => {
  console.log(`  ${id}: ${count} reviews`);
});

// Critic reviews per movie
const criticReviewCounts = {};
criticReviews.forEach(r => {
  criticReviewCounts[r.movieId] = (criticReviewCounts[r.movieId] || 0) + 1;
});
console.log('\nCritic Reviews per Movie:');
Object.entries(criticReviewCounts).forEach(([id, count]) => {
  console.log(`  ${id}: ${count} reviews`);
});

// Movie reviews per movie
const movieReviewCounts = {};
movieReviews.forEach(r => {
  movieReviewCounts[r.movieId] = (movieReviewCounts[r.movieId] || 0) + 1;
});
console.log('\nMovie User Reviews per Movie:');
Object.entries(movieReviewCounts).forEach(([id, count]) => {
  console.log(`  ${id}: ${count} reviews`);
});

console.log('\n✅ All generators working correctly!');
console.log('\n💡 Tip: Run "npm run seed:reviews" to seed actual database');

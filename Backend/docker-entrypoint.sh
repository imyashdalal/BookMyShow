#!/bin/sh
set -e

echo "🚀 Starting Movie Booking App Backend..."

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
until nc -z mongodb 27017; do
  echo "   MongoDB is unavailable - sleeping"
  sleep 2
done
echo "✅ MongoDB is up and running!"

# Check if database needs seeding
echo "🔍 Checking if database needs seeding..."

# Run a simple check to see if data exists
DATA_CHECK=$(node -e "
const mongoose = require('mongoose');
const Movie = require('./models/movies.model');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/movie-booking-app');
    const count = await Movie.countDocuments();
    console.log(count);
    await mongoose.connection.close();
  } catch (err) {
    console.log(0);
    process.exit(0);
  }
})();
" 2>/dev/null || echo "0")

if [ "$DATA_CHECK" -eq "0" ]; then
  echo "📦 Database is empty. Running seed script..."
  npm run seed
  echo "✅ Database seeded successfully!"
else
  echo "✅ Database already contains $DATA_CHECK movies. Skipping seed."
fi

# Start the application
echo "🎬 Starting the application..."
exec "$@"

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function verifyShows() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const TheatreHallMovieMapping = require('../models/theatre-hall-movie-mapping');
    
    // Get total count
    const total = await TheatreHallMovieMapping.countDocuments();
    console.log(`Total show mappings: ${total}\n`);
    
    // Get unique dates
    const dates = await TheatreHallMovieMapping.distinct('showDate');
    console.log(`Unique show dates (${dates.length} days):`);
    dates.sort().forEach(date => console.log(`  - ${date}`));
    console.log();
    
    // Get count per date
    const pipeline = [
      {
        $group: {
          _id: '$showDate',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];
    
    const countsPerDate = await TheatreHallMovieMapping.aggregate(pipeline);
    console.log('Shows per day:');
    countsPerDate.forEach(({ _id, count }) => {
      console.log(`  ${_id}: ${count} shows`);
    });
    console.log();
    
    // Sample some shows
    const samples = await TheatreHallMovieMapping.find({}).limit(3).populate('movieId theatreHallId');
    console.log('Sample show mappings:');
    samples.forEach((show, i) => {
      console.log(`\n${i + 1}. Movie: ${show.movieId?.title || 'Unknown'}`);
      console.log(`   Hall: ${show.theatreHallId?._id || 'Unknown'}`);
      console.log(`   Date: ${show.showDate}`);
      console.log(`   Time: ${show.startTimestamp} - ${show.endTimestamp}`);
      console.log(`   Price: ₹${show.price}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Verification complete');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyShows();

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function clearMappings() {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'NOT FOUND');
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI not found in environment');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const count = await mongoose.connection.collection('theatrehallmoviemappings').countDocuments();
    console.log(`Current count: ${count} mappings`);

    if (count > 0) {
      await mongoose.connection.collection('theatrehallmoviemappings').drop();
      console.log('✅ Dropped theatrehallmoviemappings collection');
    } else {
      console.log('Collection is empty or does not exist');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

clearMappings();

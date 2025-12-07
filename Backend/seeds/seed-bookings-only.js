#!/usr/bin/env node

/**
 * Quick script to seed only booking data for analytics
 * Run this if you already have shows and users in the database
 * 
 * Usage: node seed-bookings-only.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import the booking seed function
const { seedBookings } = require('./booking.seed');

console.log('╔═══════════════════════════════════════════════════╗');
console.log('║   Quick Booking Seed - Analytics Dashboard       ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

// Run the seed
seedBookings();

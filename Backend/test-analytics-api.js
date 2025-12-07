// Quick test to verify analytics endpoints after seeding
// Run this in Node.js to test the backend endpoints

const http = require('http');

const BASE_URL = 'http://localhost:8000';

// You'll need to replace this with a real admin token
// Get it by logging in as admin and copying from localStorage
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

const endpoints = [
  '/admin/analytics/dashboard',
  '/admin/analytics/recent-bookings?limit=5',
  '/admin/analytics/top-movies?limit=5',
  '/admin/analytics/monthly-revenue?months=6',
  '/admin/analytics/theatre-stats',
  '/admin/analytics/platform-stats'
];

async function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(data)
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Analytics Endpoints\n');
  console.log('Make sure to replace ADMIN_TOKEN with your actual token!\n');

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const result = await testEndpoint(endpoint);
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Data:`, JSON.stringify(result.data, null, 2).substring(0, 200) + '...\n');
    } catch (error) {
      console.error(`❌ Error:`, error.message, '\n');
    }
  }
}

if (ADMIN_TOKEN === 'YOUR_ADMIN_TOKEN_HERE') {
  console.log('⚠️  Please set ADMIN_TOKEN first!');
  console.log('\n📝 Steps:');
  console.log('1. Login to frontend as admin');
  console.log('2. Open browser console (F12)');
  console.log('3. Run: localStorage.getItem("token")');
  console.log('4. Copy the token');
  console.log('5. Replace ADMIN_TOKEN in this file');
  console.log('6. Run: node test-analytics-api.js\n');
} else {
  runTests();
}

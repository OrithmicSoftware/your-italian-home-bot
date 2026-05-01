// scripts/test-health.js
require('dotenv').config();
const https = require('https');

const url = process.env.PRODUCTION_URL || 'https://your-italian-home-bot-production.up.railway.app';

const options = {
  hostname: url.replace(/^https?:\/\//, ''),
  path: '/health',
  method: 'GET',
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.end();

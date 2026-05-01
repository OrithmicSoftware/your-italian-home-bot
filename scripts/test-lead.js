// scripts/test-lead.js
require('dotenv').config();
const https = require('https');

const url = process.env.PRODUCTION_URL || 'https://your-italian-home-bot-production.up.railway.app';
const data = JSON.stringify({
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a test lead from script.'
});

const options = {
  hostname: url.replace(/^https?:\/\//, ''),
  path: '/lead',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
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

req.write(data);
req.end();

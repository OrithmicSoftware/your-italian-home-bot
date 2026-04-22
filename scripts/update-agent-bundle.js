// scripts/update-agent-bundle.js
// Copies the latest telegram-comm-agent.min.js from ../telegram-comm-agent/dist to ./lib

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../telegram-comm-agent/dist/telegram-comm-agent.min.js');
const DEST = path.resolve(__dirname, '../your-italian-home-bot/lib/telegram-comm-agent.min.js');

if (!fs.existsSync(SRC)) {
  console.error('Source bundle not found:', SRC);
  process.exit(1);
}

fs.copyFileSync(SRC, DEST);
console.log('Updated bundle:', DEST);

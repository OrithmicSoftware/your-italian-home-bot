// scripts/validate-env.js
require('dotenv').config();
const requiredVars = [
  'BOT_TOKEN',
  'ADMIN_CHAT_ID',
  'AGENT_CHAT_ID'
];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `\n[ERROR] Missing required environment variables: ${missing.join(', ')}\n` +
    'Set them in your environment or in Vercel project settings.\n'
  );
  process.exit(1);
} else {
  console.log('[OK] All required environment variables are set.');
}

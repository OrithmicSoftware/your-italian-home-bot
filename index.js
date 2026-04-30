// Debug: print env vars at startup (mask values for safety)
console.log('[DEBUG] process.env at startup:', Object.fromEntries(Object.entries(process.env).map(([k, v]) => [k, v && v.length > 0 ? '***' : v])));

const config = require('./settings/config');
const secrets = require('./settings/secrets');
const { createCommAgent } = require('telegram-comm-agent');

const bot = createCommAgent(config, secrets);
bot.launch();

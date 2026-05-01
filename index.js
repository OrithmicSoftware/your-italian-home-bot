
const config = require('./settings/config');
const secrets = require('./settings/secrets');
const { createCommAgent, createLeadWebServer } = require('telegram-comm-agent');

const bot = createCommAgent(config, secrets);
bot.launch();

// Start the web server for lead handling
const port = process.env.PORT || 3000;
createLeadWebServer({
  BOT_TOKEN: secrets.BOT_TOKEN,
  ADMIN_CHAT_ID: secrets.ADMIN_CHAT_ID,
  AGENT_CHAT_ID: secrets.AGENT_CHAT_ID,
  port,
  botInstance: bot,
  formatLead: config.STRINGS.LEAD_TEMPLATE,
  STRINGS: config.STRINGS,
  TRACK_DESTINATIONS: config.TRACK_DESTINATIONS
});
console.log(`[your-italian-home-bot] Web server listening on port ${port}`);

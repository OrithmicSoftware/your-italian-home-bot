// Example secrets.js for your-italian-home-bot (based on telegram-comm-agent)
// Loads secrets from environment variables

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID,
  AGENT_CHAT_ID: process.env.AGENT_CHAT_ID,
  FORWARD_TO_AGENT: process.env.FORWARD_TO_AGENT,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
};

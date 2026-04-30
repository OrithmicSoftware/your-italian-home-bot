const config = require('./settings/config');
const secrets = require('./settings/secrets');
const { createCommAgent } = require('telegram-comm-agent');

const bot = createCommAgent(config, secrets);
bot.launch();

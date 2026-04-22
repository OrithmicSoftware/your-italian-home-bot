const { Telegraf } = require('telegraf');
const config = require('./settings/config.js');
const secrets = require('./settings/secrets.js');
const { createCommAgent } = require('../lib/telegram-comm-agent.min.js');

const bot = createCommAgent(Telegraf, config, secrets);

module.exports = async (req, res) => {
  await bot.handleUpdate(req.body);
  res.status(200).end();
};
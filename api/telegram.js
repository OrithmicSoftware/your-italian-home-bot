const { Telegraf } = require('telegraf');
const config = require('./settings/config.js');
const secrets = require('./settings/secrets.js');
const { createCommAgent } = require('../lib/telegram-comm-agent.min.js');

const bot = createCommAgent(Telegraf, config, secrets);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, message: 'Telegram bot endpoint is live' });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  if (!req.body) {
    res.status(400).json({ error: 'Missing body' });
    return;
  }
  try {
    await bot.handleUpdate(req.body);
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ error: 'Bot error', details: err.message });
  }
};
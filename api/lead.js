const secrets = require('./settings/secrets.js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const { name, phone, message } = req.body;
  const msg = `New lead from website:\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
  try {
    const { Telegraf } = require('telegraf');
    const bot = new Telegraf(secrets.BOT_TOKEN);
    await bot.telegram.sendMessage(secrets.ADMIN_CHAT_ID, msg);
    await bot.telegram.sendMessage(secrets.AGENT_CHAT_ID, msg);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
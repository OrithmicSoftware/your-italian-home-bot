require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const AGENT_CHAT_ID = process.env.AGENT_CHAT_ID;

if (!BOT_TOKEN || !ADMIN_CHAT_ID || !AGENT_CHAT_ID) {
  console.error('Missing BOT_TOKEN, ADMIN_CHAT_ID, or AGENT_CHAT_ID in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();
app.use(express.json());

// Endpoint to receive leads from the website
app.post('/lead', async (req, res) => {
  const { name, phone, message } = req.body;
  const msg = `Новая заявка с сайта:\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message}`;
  try {
    // Notify ADMIN
    await bot.telegram.sendMessage(ADMIN_CHAT_ID, msg);
    // Forward to AGENT
    await bot.telegram.sendMessage(AGENT_CHAT_ID, msg);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error sending lead:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

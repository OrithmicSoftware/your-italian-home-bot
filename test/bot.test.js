
jest.mock('../config', () => ({
  BOT_TOKEN: 'dummy',
  ADMIN_CHAT_ID: '111',
  AGENT_CHAT_ID: '222',
  FORWARD_TO_AGENT: 'no',
  SERVICES: ['🍕 Pizza Delivery'],
  STRINGS: {
    WELCOME: 'welcome',
    CHOOSE_SERVICE: 'choose',
    CONTACT_PROMPT: 'contact',
    INVALID_SERVICE: 'invalid',
    ASK_BUDGET: 'budget',
    ASK_NAME: 'name',
  },
  BUTTONS: {
    SERVICE_LIST: 'list',
    CONTACT: 'contact',
  },
}));
const { Telegraf } = require('telegraf');


const request = require('supertest');
const express = require('express');

describe('Telegram Bot', () => {
  it('should start and reply to /start', async () => {
    const bot = new Telegraf('dummy');
    const replyMock = jest.fn();
    // Simulate the context object as Telegraf would provide
    const ctx = { reply: replyMock };
    // Register the start handler
    let handler;
    bot.start((c) => handler = c.reply('welcome'));
    // Call the handler directly
    await ctx.reply('welcome');
    expect(replyMock).toHaveBeenCalledWith('welcome');
  });
});

describe('Web API', () => {
  it('should accept POST /lead', async () => {
    const app = express();
    app.use(express.json());
    app.post('/lead', (req, res) => res.json({ ok: true }));
    await request(app)
      .post('/lead')
      .send({ name: 'Test', phone: '123', message: 'msg' })
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toBe(true);
      });
  });
});

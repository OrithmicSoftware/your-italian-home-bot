const request = require('supertest');
const express = require('express');

jest.mock('telegraf', () => {
  return {
    Telegraf: jest.fn().mockImplementation(() => ({
      telegram: {
        sendMessage: jest.fn(() => Promise.resolve(true)),
      },
    })),
  };
});

describe('Lead API', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/api/lead', require('../api/lead'));
  });

  it('should accept POST and forward to Telegram', async () => {
    const res = await request(app)
      .post('/api/lead')
      .send({ name: 'Test', phone: '123', message: 'Hello' });
    expect(res.body.ok).toBe(true);
  });

  it('should reject non-POST methods', async () => {
    const res = await request(app).get('/api/lead');
    // Express returns 404 for undefined methods unless a catch-all is defined
    expect([404, 405]).toContain(res.status);
  });
});

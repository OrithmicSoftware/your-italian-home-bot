const request = require('supertest');
const express = require('express');

jest.mock('../lib/telegram-comm-agent.min.js', () => {
  return {
    createCommAgent: jest.fn(() => ({
      handleUpdate: jest.fn(() => Promise.resolve()),
    })),
  };
});

describe('Telegram API', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/api/telegram', require('../api/telegram'));
  });

  it('should call handleUpdate on POST', async () => {
    const res = await request(app)
      .post('/api/telegram')
      .send({ update_id: 1, message: { text: 'hi' } });
    expect(res.status).toBe(200);
  });
});

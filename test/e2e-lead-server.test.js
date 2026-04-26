// E2E test that starts/stops the server for /lead endpoint
defineTest();

function defineTest() {
  const { createCommAgent } = require('telegram-comm-agent');
  const { createWebServer } = require('telegram-comm-agent');
  const config = require('../settings/config');
  const secrets = require('../settings/secrets');
  const request = require('supertest');

  let server;
  let bot;

  beforeAll((done) => {
    bot = createCommAgent(config, secrets);
    server = createWebServer({
      BOT_TOKEN: secrets.BOT_TOKEN,
      ADMIN_CHAT_ID: secrets.ADMIN_CHAT_ID,
      AGENT_CHAT_ID: secrets.AGENT_CHAT_ID,
      port: 3999,
      botInstance: bot,
      debugPassword: 'testpass'
    });
    // Wait for server to start
    setTimeout(done, 500);
  });

  afterAll((done) => {
    if (server && server.close) server.close(done);
    else done();
  });

  describe('E2E /lead endpoint (auto server)', () => {
    it('should accept and forward a valid lead', async () => {
      const res = await request('http://localhost:3999')
        .post('/lead')
        .send({ name: 'E2E Test', phone: '+123456789', message: 'Local E2E test message' });
      expect([200, 201]).toContain(res.status);
      expect(res.body.ok).toBe(true);
    });

    it('should reject missing fields', async () => {
      const res = await request('http://localhost:3999')
        .post('/lead')
        .send({ name: '', phone: '', message: 'No info' });
      expect([200, 400, 422, 404]).toContain(res.status);
      expect(res.body.ok).toBe(false);
    });
  });
}

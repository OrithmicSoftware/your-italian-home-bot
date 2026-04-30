const fetch = require('node-fetch');
const { createLeadWebServer } = require('telegram-comm-agent');

// Inject dummy secrets for test isolation (no env dependency)
const secrets = {
  BOT_TOKEN: 'test-token',
  ADMIN_CHAT_ID: 'admin-id',
  AGENT_CHAT_ID: 'agent-id',
  FORWARD_TO_AGENT: 'all',
  CORS_ORIGINS: '*',
};

describe('E2E: /lead endpoint', () => {
  let server;
  let sentMessages;
  const port = 34567;
  const url = `http://localhost:${port}/lead`;


  beforeAll(() => {
    sentMessages = [];
    // Inject a mocked botInstance to avoid real Telegram calls
    const botInstance = {
      telegram: {
        sendMessage: (chatId, msg) => {
          sentMessages.push({ chatId, msg });
          return Promise.resolve();
        }
      }
    };
    server = createLeadWebServer({
      ...secrets,
      port,
      botInstance,
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should accept a valid lead', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'E2E User',
        phone: '+1234567890',
        message: 'E2E test message'
      })
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    // Check that both admin and agent received the message
    expect(sentMessages.length).toBe(2);
    const adminMsg = sentMessages.find(m => m.chatId === 'admin-id');
    const agentMsg = sentMessages.find(m => m.chatId === 'agent-id');
    expect(adminMsg).toBeTruthy();
    expect(agentMsg).toBeTruthy();
    expect(adminMsg.msg).toContain('E2E User');
    expect(agentMsg.msg).toContain('E2E User');
  });

  it('should reject missing fields', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', phone: '', message: '' })
    });
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.ok).toBe(false);
  });
});

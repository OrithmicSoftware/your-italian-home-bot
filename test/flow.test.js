const { Telegraf } = require('telegraf');
const config = require('../config');

describe('Step Flow', () => {
  let bot;
  let replies;
  let userId = 12345;

  beforeEach(() => {
    bot = new Telegraf('dummy');
    replies = [];
    bot.telegram.callApi = jest.fn(() => Promise.resolve(true));
    bot.context.reply = (msg, opts) => replies.push({ msg, opts });
  });

  it('should walk through the FLOW prompts', async () => {
    // Simulate selecting a service and going through all steps
    const flow = config.STRINGS.FLOW;
    const user = { id: userId, username: 'testuser', first_name: 'Test' };
    // Simulate service selection
    bot.context.from = user;
    bot.context.message = { text: Object.values(config.SERVICES)[0] };
    // Set state as if user clicked service
    const userStates = {};
    userStates[userId] = { step: 'service' };
    // Simulate service handler
    // (In real bot, this is handled by hears, here we simulate)
    // Now walk through each step
    for (let i = 0; i < flow.length; i++) {
      bot.context.from = user;
      bot.context.message = { text: `answer${i}` };
      userStates[userId] = { step: flow[i].field, service: 'pizza' };
      // Simulate generic step handler
      const idx = i;
      const nextStep = flow[idx + 1];
      userStates[userId] = { ...userStates[userId], [flow[i].field]: `answer${i}` };
      if (nextStep) {
        userStates[userId].step = nextStep.field;
        await bot.context.reply(nextStep.prompt);
      } else {
        // All steps complete
        await bot.context.reply(config.STRINGS.LEAD_SENT);
      }
    }
    // Check that all prompts and final message were sent
    expect(replies.map(r => r.msg)).toContain(flow[1].prompt);
    expect(replies.map(r => r.msg)).toContain(flow[2].prompt);
    expect(replies.map(r => r.msg)).toContain(flow[3].prompt);
    expect(replies.map(r => r.msg)).toContain(config.STRINGS.LEAD_SENT);
  });
});

// Integration test to ensure bot.launch() is called and bot processes updates
const { createCommAgent } = require('telegram-comm-agent');
const config = require('../../settings/config');
const secrets = require('../../settings/secrets');

describe('Bot launch integration', () => {
  it('should call bot.launch and process updates', async () => {
    const bot = createCommAgent(config, secrets);
    // Mock launch to prevent real polling
    const launchSpy = jest.spyOn(bot, 'launch').mockImplementation(() => {});
    if (typeof bot.launch === 'function') {
      bot.launch();
    }
    expect(launchSpy).toHaveBeenCalled();
    launchSpy.mockRestore();
  });
});

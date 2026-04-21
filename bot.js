const { createCommAgent, createLeadWebServer, makeCorsConfig } = require('./lib/telegram-comm-agent.min.js');
const config = require('./config');
const secrets = require('./secrets');

const bot = createCommAgent(config, secrets);
bot.launch();

// Launch the web server for /lead endpoint with CORS
createLeadWebServer({
	...secrets,
	formatLead: ({ name, phone, message }) =>
		config.STRINGS.LEAD_TEMPLATE(
			{ service: 'web', name, phone, message },
			{ username: 'webform', first_name: 'Web', id: 0 }
		),
	port: process.env.PORT || 3000,
	botInstance: bot,
	// use CORS origins strictly from consumer-provided secrets (no fallback)
	cors: makeCorsConfig(secrets.CORS_ORIGINS),
});

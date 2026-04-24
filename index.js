// Entrypoint for Railway or any persistent Node.js host

const config = require('./settings/config');
const secrets = require('./settings/secrets');

const fs = require('fs');
const path = require('path');

const { createCommAgent } = require('telegram-comm-agent');
const { createWebServer } = require('telegram-comm-agent/web-server');

const DEBUG_API_PASSWORD = process.env.DEBUG_API_PASSWORD || 'changeme';
const LOG_FILE = path.join(__dirname, 'bot-log.txt');
let pollHistory = [];
let logBuffer = [];
const MAX_LOG_LINES = 200;

function logLine(line) {
	const ts = new Date().toISOString();
	const entry = `[${ts}] ${line}`;
	logBuffer.push(entry);
	if (logBuffer.length > MAX_LOG_LINES) logBuffer.shift();
	fs.appendFileSync(LOG_FILE, entry + '\n');
}

// Patch console.log/error for bot logs
const origLog = console.log;
const origErr = console.error;
console.log = (...args) => { origLog(...args); logLine(args.join(' ')); };
console.error = (...args) => { origErr(...args); logLine('[ERROR] ' + args.join(' ')); };


const bot = createCommAgent(config, secrets);
bot.launch();

// Start the built-in web lead server with debug endpoints enabled
createWebServer({
  BOT_TOKEN: secrets.BOT_TOKEN,
  ADMIN_CHAT_ID: secrets.ADMIN_CHAT_ID,
  AGENT_CHAT_ID: secrets.AGENT_CHAT_ID,
  port: process.env.PORT || 3000,
  botInstance: bot,
  debugPassword: process.env.DEBUG_API_PASSWORD || 'changeme'
});
console.log('Bot and web lead server started.');

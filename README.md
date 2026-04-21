# Badges

[![CI](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/ci.yml/badge.svg)](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/ci.yml)
[![Labels](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/sync-labels.yml/badge.svg)](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/sync-labels.yml)

# Telegram Communication Agent

Generic, configurable Telegram communication agent bot template.

## Features
- Data-driven, step-by-step service selection
- Collects user info (service, budget, district, name, phone, etc.)
- Sends leads/messages to admin and agent
- All strings, prompts, and flow are configurable in `config.js`
- English, safe example config for onboarding


## Setup
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your tokens
3. Copy `config.example.js` to `config.js` and customize all fields as needed (see comments in the file)
4. Run `npm install`
5. Start with `npm start`

## Configuration & Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
BOT_TOKEN=your_bot_token_here
ADMIN_CHAT_ID=your_admin_chat_id
AGENT_CHAT_ID=your_agent_chat_id
FORWARD_TO_AGENT=ask
```

- `BOT_TOKEN`: Telegram bot token
- `ADMIN_CHAT_ID`: Telegram chat ID for admin notifications
- `AGENT_CHAT_ID`: Telegram chat ID for agent forwarding
- `FORWARD_TO_AGENT`: 'no', 'all', or 'ask' (see .env.example for details)

### Centralized Strings & UI
All user/admin-facing strings, menu labels, and step flow are in `config.js`.
- To localize or update UI text, edit `config.js`.
- Do not hardcode strings in `bot.js`.
- See `config.example.js` for a safe, English, unrelated onboarding example.

### Services Structure
Services are defined as an object in `config.js`:

```
SERVICES: {
	pizza: '🍕 Pizza Delivery',
	car: '🚗 Car Rental',
	...
}
```

### Pre-commit Hooks
Lint and test run automatically before every commit using Husky:
- To set up: `npm install --save-dev husky` (already included)
- Hooks are in `.husky/pre-commit`

### Sensitive Data
- Never commit `.env` or `config.js` with real secrets.
- Both are in `.gitignore` by default.

## License
MIT
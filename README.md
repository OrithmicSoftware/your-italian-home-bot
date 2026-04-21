# Your Italian Home Bot

Telegram bot for real estate and relocation services in Italy.

## Features
- Step-by-step service selection
- Collects user info (service, budget, district, name, phone)
- Sends leads to admin and agent
- Russian language interface

## Setup
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your tokens
3. Run `npm install`
4. Start with `npm start`

## Environment Variables
- `BOT_TOKEN` — Telegram bot token
- `ADMIN_CHAT_ID` — Admin Telegram chat ID
- `AGENT_CHAT_ID` — Agent Telegram chat ID
- `FORWARD_TO_AGENT` — Set to `false` to disable agent forwarding

## License
MIT
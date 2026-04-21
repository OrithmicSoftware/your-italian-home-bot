# Configuration for your-italian-home-bot

## Environment Variables
Copy `.env.example` to `.env` and fill in your values:

```
BOT_TOKEN=your_bot_token_here
ADMIN_CHAT_ID=your_admin_chat_id
AGENT_CHAT_ID=your_agent_chat_id
FORWARD_TO_AGENT=true
```

- `BOT_TOKEN`: Telegram bot token
- `ADMIN_CHAT_ID`: Telegram chat ID for admin notifications
- `AGENT_CHAT_ID`: Telegram chat ID for agent forwarding
- `FORWARD_TO_AGENT`: Set to `false` to disable agent forwarding (default: true)

## Centralized Strings & UI
All user-facing strings and menu labels are in `config.js`.

- To localize or update UI text, edit `config.js`.
- Do not hardcode strings in `bot.js`.

## Sensitive Data
- Never commit `.env` with real secrets.
- `.env` is in `.gitignore` by default.

## Example Usage
See `bot.js` for usage of config and environment variables.

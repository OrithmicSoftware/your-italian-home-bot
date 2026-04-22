# Badges

[![Lint](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/lint.yml/badge.svg)](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/lint.yml)
[![Test](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/test.yml/badge.svg)](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/test.yml)


# Your Italian Home Bot


This is a minimal consumer of the [telegram-comm-agent](https://github.com/OrithmicSoftware/telegram-comm-agent) library.

## Integration Note

This project now uses a single bundled file: `lib/telegram-comm-agent.min.js`.
You do not need the full source or dist directory from the library—just this minified bundle.

All bot logic, step flow, and process handling are managed by the library. See the [telegram-comm-agent documentation](https://github.com/OrithmicSoftware/telegram-comm-agent) for full configuration, flow, and API details.

### Quick Start

1. Copy `telegram-comm-agent.min.js` from the library's `dist/bundle.js`.
2. Place it in `lib/telegram-comm-agent.min.js`.
3. Use it in your bot:

```js
const { createCommAgent, createLeadWebServer, makeCorsConfig } = require('./lib/telegram-comm-agent.min.js');
```

No other files from the library are required.

## Usage


1. Copy `secrets.example.js` from the library to your project and fill in your values, or use environment variables.
2. Add your secrets as needed.
3. Run `npm install` and start the bot with `npm start`.


All bot logic, step flow, and process handling are managed by the library. See the [telegram-comm-agent documentation](https://github.com/OrithmicSoftware/telegram-comm-agent) for full configuration, flow, and API details.
* Do not hardcode strings in `bot.js`.

### Services Structure

Services are defined in your configuration object or environment:

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


### CORS Configuration
The consumer must provide allowed origins via `CORS_ORIGINS` in `secrets` or the environment (comma-separated or array). The library will build the CORS config from `secrets.CORS_ORIGINS`. Example:

```
CORS_ORIGINS=https://orithmicsoftware.github.io,https://yourdomain.com
```

Do not rely on a local `cors.config.js` file — prefer `secrets.CORS_ORIGINS` so deployments can set origins via env.

### Sensitive Data
- Never commit `.env` or `config.js` with real secrets.

# Health check

GET /api/telegram
```
curl https://your-italian-home-bot.vercel.app/api/telegram
```

# Send Telegram update (POST)

POST /api/telegram
```
curl -X POST https://your-italian-home-bot.vercel.app/api/telegram \
	-H "Content-Type: application/json" \
	-d '{"update_id":123,"message":{"message_id":1,"from":{"id":1,"is_bot":false,"first_name":"Test"},"chat":{"id":1,"type":"private"},"date":1234567890,"text":"/start"}}'
```

## License
MIT
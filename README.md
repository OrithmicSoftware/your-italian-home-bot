
# Badges

[![Lint](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/lint.yml/badge.svg)](https://github.com/OrithmicSoftware/your-italian-home-bot/actions/workflows/lint.yml)

# Your Italian Home Bot

This is a minimal consumer of the [telegram-comm-agent](https://github.com/OrithmicSoftware/telegram-comm-agent) library.

## Usage

1. Copy `config.example.js` and `secrets.example.js` from the library to your project and fill in your values.
2. Add your configuration and secrets as needed.
3. Run `npm install` and start the bot with `npm start`.

All bot logic, step flow, and process handling are managed by the library. See the [telegram-comm-agent documentation](https://github.com/OrithmicSoftware/telegram-comm-agent) for full configuration, flow, and API details.
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


### CORS Configuration
The consumer must provide allowed origins via `CORS_ORIGINS` in `secrets` or the environment (comma-separated or array). The library will build the CORS config from `secrets.CORS_ORIGINS`. Example:

```
CORS_ORIGINS=https://orithmicsoftware.github.io,https://yourdomain.com
```

Do not rely on a local `cors.config.js` file — prefer `secrets.CORS_ORIGINS` so deployments can set origins via env.

### Sensitive Data
- Never commit `.env` or `config.js` with real secrets.

## License
MIT
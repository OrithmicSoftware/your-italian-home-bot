// Example config.js for your-italian-home-bot
// Copy to config.js and fill in your values, or use environment variables

// FORWARD_TO_AGENT: 'no', 'all', or 'ask'
//   no  - never forward to agent
//   all - always forward to agent
//   ask - prompt user before forwarding
module.exports = {
  BOT_TOKEN: 'example_bot_token_123456',
  ADMIN_CHAT_ID: '111111111',
  AGENT_CHAT_ID: '222222222',
  FORWARD_TO_AGENT: 'ask',

  SERVICES: [
    '🍕 Pizza Delivery',
    '🚗 Car Rental',
    '🎟 Event Booking',
    '🏨 Hotel Reservation',
    '📦 Package Tracking',
    '💬 General Inquiry',
  ],

  STRINGS: {
    WELCOME: 'Hello! I am your friendly assistant bot. I can help you order pizza, rent a car, book events, and more!\n\nPlease use the menu below to get started.',
    CHOOSE_SERVICE: 'Please select a service from the menu below:',
    CONTACT_PROMPT: 'Please provide your name and details. I will get back to you soon!',
    INVALID_SERVICE: 'Please select a valid service from the list.',
    ASK_BUDGET: 'Please enter your budget:',
    ASK_NAME: 'Please enter your name:',
  },

  BUTTONS: {
    SERVICE_LIST: '📋 List Services',
    CONTACT: '✉️ Contact',
  },
};

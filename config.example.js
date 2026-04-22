// Example config.js for your-italian-home-bot (based on telegram-comm-agent)
// Copy to config.js and fill in your values, or use environment variables

module.exports = {
  BOT_TOKEN: 'example_bot_token_123456',
  ADMIN_CHAT_ID: '111111111',
  AGENT_CHAT_ID: '222222222',
  FORWARD_TO_AGENT: 'ask', // 'no', 'all', or 'ask'

  // Service definitions (update as needed)
  SERVICES: {
    buy: '🏠 Покупка недвижимости',
    rent: '🏡 Аренда недвижимости',
    docs: '📑 Оформление документов',
    taxes: '💶 Налоги и бухгалтерия',
    deals: '🤝 Сопровождение сделок',
    consult: '🗣 Консультации по переезду и жизни в Италии',
  },

  // Step definitions and flows
  STEP_DEFS: {
    budget: 'Пожалуйста, укажите ваш бюджет:',
    district: 'Пожалуйста, укажите интересующий район:',
    name: 'Пожалуйста, напишите ваше имя:',
    phone: 'Пожалуйста, напишите ваш номер телефона:'
  },
  STEP_FLOWS: {
    property: ['budget', 'district', 'name', 'phone'],
    simple: ['name', 'phone']
  },
  SERVICE_FLOW_MAP: {
    buy: 'property',
    rent: 'property',
    docs: 'simple',
    taxes: 'simple',
    deals: 'simple',
    consult: 'simple'
  },

  // UI Strings
  STRINGS: {
    WELCOME: 'Здравствуйте! Я Людмила, сертифицированный риэлтор и бухгалтер (Пьемонте, Лигурия). Живу в Турине 8+ лет. Помогаю с покупкой, арендой, налогами, оформлением документов и сопровождением сделок.\n\nПожалуйста, напишите: имя, бюджет и район, чтобы я могла вам помочь.\n\nℹ️ Используйте меню внизу для быстрого выбора.',
    APPROVE_BTN: '✅ Одобрить и отправить агенту',
    REJECT_BTN: '❌ Отклонить',
    FORWARD_PROMPT: 'Forward this to agent?',
    FORWARD_BTN: '➡️ Forward to Agent',
    NO_FORWARD_BTN: '🚫 Do Not Forward',
    WAITING_FORWARD_CONFIRM: 'Ожидает подтверждения для отправки агенту.',
    CHOOSE_SERVICE: 'Пожалуйста, выберите интересующую услугу из меню ниже:',
    CONTACT_PROMPT: 'Пожалуйста, напишите ваше имя, бюджет и интересующий район. Я свяжусь с вами в ближайшее время!',
    INVALID_SERVICE: 'Пожалуйста, выберите услугу из списка.'
  },

  BUTTONS: {
    SERVICE_LIST: '📋 Список услуг',
    CONTACT: '✉️ Контакт',
  },
};

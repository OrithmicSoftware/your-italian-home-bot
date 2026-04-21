require('dotenv').config();
// Centralized config and strings for your-italian-home-bot

// Service definitions (shared locally so templates can reference safely)
const SERVICES_OBJ = {
  buy: '🏠 Покупка недвижимости',
  rent: '🏡 Аренда недвижимости',
  docs: '📑 Оформление документов',
  taxes: '💶 Налоги и бухгалтерия',
  deals: '🤝 Сопровождение сделок',
  consult: '🗣 Консультации по переезду и жизни в Италии',
};

// FORWARD_TO_AGENT: 'no', 'all', or 'ask'
const FORWARD_TO_AGENT = process.env.FORWARD_TO_AGENT || 'ask';

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID,
  AGENT_CHAT_ID: process.env.AGENT_CHAT_ID,
  FORWARD_TO_AGENT,

  // Reusable step definitions (single source of truth)
  STEP_DEFS: {
    budget: 'Пожалуйста, укажите ваш бюджет:',
    district: 'Пожалуйста, укажите интересующий район:',
    name: 'Пожалуйста, напишите ваше имя:',
    phone: 'Пожалуйста, напишите ваш номер телефона:'
  },

  // Step flows reference step keys from STEP_DEFS to avoid duplication
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

  // Service list (object for extensibility)
  SERVICES: SERVICES_OBJ,

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
    INVALID_SERVICE: 'Пожалуйста, выберите услугу из списка.',
    FLOW: [
      { field: 'budget', prompt: 'Пожалуйста, укажите ваш бюджет:' },
      { field: 'district', prompt: 'Пожалуйста, укажите интересующий район:' },
      { field: 'name', prompt: 'Пожалуйста, напишите ваше имя:' },
      { field: 'phone', prompt: 'Пожалуйста, напишите ваш номер телефона:' }
    ],
    LEAD_TEMPLATE: (collected, user) => {
      const serviceLabel = collected.service ? (SERVICES_OBJ[collected.service] || collected.service) : '';
      let msg = `Новая заявка:\nУслуга: ${serviceLabel}`;
      if (collected.budget) msg += `\nБюджет: ${collected.budget}`;
      if (collected.district) msg += `\nРайон: ${collected.district}`;
      msg += `\nИмя: ${collected.name}\nТелефон: ${collected.phone}\n@${user.username || user.first_name} (${user.id})`;
      return msg;
    },
    LEAD_SENT: 'Спасибо! Ваша заявка отправлена администратору на рассмотрение.',
    APPROVED_CB: 'Заявка отправлена агенту.',
    REJECTED_CB: 'Заявка отклонена.',
    UNKNOWN_CB: 'Неизвестное действие.',
    CONFIG_ERROR_USER: 'Произошла неизвестная ошибка. Мы уведомили администратора.',
    CONFIG_ERROR_ADMIN_PREFIX: 'Config error:',
    MSG_TEMPLATE: (user, text) => `New message from @${user.username || user.first_name} (${user.id}):\n${text}`,
    MSG_SENT: 'Спасибо! Ваше сообщение отправлено администратору на рассмотрение.',
  },

  // Menu button labels
  BUTTONS: {
    SERVICE_LIST: '📋 Список услуг',
    CONTACT: '✉️ Связаться',
  },
};

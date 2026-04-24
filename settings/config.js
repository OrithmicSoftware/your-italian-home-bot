require('dotenv').config();
// Centralized config and strings for your-italian-home-bot

// Service definitions (shared locally so templates can reference safely)
const SERVICES_OBJ = {
  buy: '🏠 Покупка недвижимости',
  rent: '🏡 Аренда недвижимости',
  docs: '📑 Оформление документов',
  taxes: '💶 Налоги и бухгалтерия',
  deals: '🤝 Сопровождение сделок',
  consult: '🗣 Консультации по переезду и жизни в Италии'
};

// Robust template functions (always accept full collected object)
const LEAD_TEMPLATE = (collected) => {
  const { name, phone, ...rest } = collected || {};
  let msg = `Web Lead:\nName: ${name || ''}\nPhone: ${phone || ''}`;
  Object.entries(rest).forEach(([k, v]) => {
    msg += `\n${k}: ${v}`;
  });
  return msg;
};

const MSG_TEMPLATE = (collected) => {
  return `Message:\n` + JSON.stringify(collected, null, 2);
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

  // Robust template functions (top-level)
  LEAD_TEMPLATE,
  MSG_TEMPLATE,

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

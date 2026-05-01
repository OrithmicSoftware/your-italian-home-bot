require('dotenv').config();
// Field labels for all possible fields
const FIELD_LABELS = {
  name: 'Имя',
  phone: 'Телефон',
  service: 'Услуга',
  budget: 'Бюджет',
  district: 'Район',
  message: 'Сообщение'
};
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

// Both templates now accept (collected, user)
const LEAD_TEMPLATE = (collected, user) => {
  const allFields = { ...collected };
  let msg = `🌐 Лид с сайта 🎉\n`;
  for (const k of Object.keys(FIELD_LABELS)) {
    if (k === 'service' && allFields[k]) {
      msg += `${FIELD_LABELS[k]}: ${SERVICES_OBJ[allFields[k]] || allFields[k]}\n`;
    } else if (allFields[k]) {
      msg += `${FIELD_LABELS[k]}: ${allFields[k]}\n`;
    }
    delete allFields[k];
  }
  // Any extra fields
  Object.entries(allFields).forEach(([k, v]) => {
    msg += `${FIELD_LABELS[k] || k}: ${v}\n`;
  });
  if (user && (user.username || user.first_name)) {
    let sender = 'Отправитель:';
    if (user.first_name) sender += ` ${user.first_name}`;
    if (user.last_name) sender += ` ${user.last_name}`;
    if (user.username) sender += ` ([@${user.username}](https://t.me/${user.username}))`;
    msg += `\n${sender}`;
  }
  return msg.trim();
};

const MSG_TEMPLATE = (collected, user) => {
  const allFields = { ...collected };
  let msg = '🤖 Лид из бота 🎉\n';
  for (const k of Object.keys(FIELD_LABELS)) {
    if (k === 'service' && allFields[k]) {
      msg += `${FIELD_LABELS[k]}: ${SERVICES_OBJ[allFields[k]] || allFields[k]}\n`;
    } else if (allFields[k]) {
      msg += `${FIELD_LABELS[k]}: ${allFields[k]}\n`;
    }
    delete allFields[k];
  }
  // Any extra fields
  Object.entries(allFields).forEach(([k, v]) => {
    msg += `${FIELD_LABELS[k] || k}: ${v}\n`;
  });
  if (user && (user.username || user.first_name)) {
    let sender = 'Отправитель:';
    if (user.first_name) sender += ` ${user.first_name}`;
    if (user.last_name) sender += ` ${user.last_name}`;
    if (user.username) sender += ` ([@${user.username}](https://t.me/${user.username}))`;
    msg += `\n${sender}`;
  }
  return msg.trim();
};

// FORWARD_TO_AGENT: 'no', 'all', or 'ask'
const FORWARD_TO_AGENT = process.env.FORWARD_TO_AGENT || 'ask';



module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID,
  AGENT_CHAT_ID: process.env.AGENT_CHAT_ID,
  FORWARD_TO_AGENT,

  // Enable logging for telegram-comm-agent
  logging: {
    enable: true,
    logFile: 'bot-log.txt',
    maxLogLines: 200,
    logDir: __dirname + '/../',
  },

  // Reusable step definitions (single source of truth)
  STEP_DEFS: {
    budget: 'Пожалуйста, укажите ваш бюджет:',
    district: 'Пожалуйста, укажите интересующий район:',
    name: 'Пожалуйста, напишите ваше имя:',
    message: 'Опишите вашу просьбу:'
  },

  // Step flows reference step keys from STEP_DEFS to avoid duplication
  STEP_FLOWS: {
    property: ['budget', 'district', 'name', 'message'],
    simple: ['name', 'message']
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
  FIELD_LABELS,
  // UI Strings and templates (now includes templates as required by library)
  STRINGS: {
    // Inline callback/followup/approval/decline/unknown action messages (Russian)
    NO_FORWARD_CB: 'Заявка отклонена.',
    NO_FORWARD_FOLLOWUP: 'Заявка была отклонена и не будет отправлена агенту. Проверьте правильность введённых данных и попробуйте снова. Чтобы начать заново, отправьте /start.',
    FORWARD_CB: 'Заявка отправлена агенту.',
    FORWARD_FOLLOWUP: 'Заявка успешно отправлена агенту.',
    APPROVED_CB: 'Одобрено.',
    REJECTED_CB: 'Отклонено.',
    UNKNOWN_CB: 'Неизвестное действие.',
    WELCOME: 'Здравствуйте! Я Людмила, сертифицированный риэлтор и бухгалтер (Пьемонте, Лигурия). Живу в Турине 8+ лет. Помогаю с покупкой, арендой, налогами, оформлением документов и сопровождением сделок.\n\nПожалуйста, напишите: имя, бюджет и район, чтобы я могла вам помочь.\n\nℹ️ Используйте меню внизу для быстрого выбора.',
    APPROVE_BTN: '✅ Одобрить и отправить агенту',
    REJECT_BTN: '❌ Отклонить',
    WAITING_FORWARD_CONFIRM: 'Ожидает подтверждения для отправки агенту.',
    CHOOSE_SERVICE: 'Пожалуйста, выберите интересующую услугу из меню ниже:',
    CONTACT_PROMPT: 'Пожалуйста, напишите ваше имя, бюджет и интересующий район. Я свяжусь с вами в ближайшее время!',
    INVALID_SERVICE: 'Пожалуйста, выберите услугу из списка.',
    LEAD_SENT: 'Ваша заявка отправлена администратору на рассмотрение.',
    MSG_SENT: 'Ваше сообщение отправлено администратору.',
    // Template functions for library compatibility
    LEAD_TEMPLATE,
    MSG_TEMPLATE,
    FORWARD_BTN: 'Отправить агенту',
    NO_FORWARD_BTN: 'Оставить только у администратора'
  },

  BUTTONS: {
    SERVICE_LIST: '📋 Список услуг',
    CONTACT: '✉️ Контакт',
  },
};

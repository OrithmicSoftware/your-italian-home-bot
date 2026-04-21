
const { Telegraf } = require('telegraf');
const config = require('./config');

if (!config.BOT_TOKEN || !config.ADMIN_CHAT_ID || !config.AGENT_CHAT_ID) {
  console.error('Missing BOT_TOKEN, ADMIN_CHAT_ID, or AGENT_CHAT_ID in .env');
  process.exit(1);
}

const bot = new Telegraf(config.BOT_TOKEN);

const userStates = {};

// Главное меню
const mainMenu = {
  reply_markup: {
    keyboard: [
      [config.BUTTONS.SERVICE_LIST, config.BUTTONS.CONTACT],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

// Клавиатура выбора услуги
const serviceMenu = {
  reply_markup: {
    keyboard: config.SERVICES.map((s) => [s]),
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

// Welcome message for new users
bot.start(async (ctx) => {
  await ctx.reply(
    config.STRINGS.WELCOME,
    mainMenu
  );
});


// Обработка меню и сообщений


bot.hears(config.BUTTONS.SERVICE_LIST, async (ctx) => {
  userStates[ctx.from.id] = { step: 'service' };
  await ctx.reply(config.STRINGS.CHOOSE_SERVICE, serviceMenu);
});

bot.hears(config.BUTTONS.CONTACT, async (ctx) => {
  await ctx.reply(config.STRINGS.CONTACT_PROMPT, mainMenu);
});

// Notify ADMIN and forward to AGENT on any другое сообщение


bot.on('message', async (ctx) => {
  const user = ctx.from;
  const text = ctx.message.text || '[non-text message]';
  // Не дублируем уведомления для кнопок меню

  if ([config.BUTTONS.SERVICE_LIST, config.BUTTONS.CONTACT].includes(text)) return;

  // Step-by-step flow
  const state = userStates[user.id];
  if (state && state.step === 'service') {
    if (!config.SERVICES.includes(text)) {
      await ctx.reply(config.STRINGS.INVALID_SERVICE, serviceMenu);
      return;
    }
    // If service is Покупка or Аренда недвижимости, ask for budget next
    if (text === config.SERVICES[0] || text === config.SERVICES[1]) {
      userStates[user.id] = { step: 'budget', service: text };
      await ctx.reply(config.STRINGS.ASK_BUDGET);
      return;
    }
    // Otherwise, ask for name next
    userStates[user.id] = { step: 'name', service: text };
    await ctx.reply(config.STRINGS.ASK_NAME);
    return;
  }
  if (state && state.step === 'budget') {
    userStates[user.id] = { step: 'district', service: state.service, budget: text };
    await ctx.reply('Пожалуйста, укажите интересующий район:');
    return;
  }
  if (state && state.step === 'district') {
    userStates[user.id] = { step: 'name', service: state.service, budget: state.budget, district: text };
    await ctx.reply('Пожалуйста, напишите ваше имя:');
    return;
  }
  if (state && state.step === 'name') {
    userStates[user.id] = { step: 'phone', service: state.service, budget: state.budget, district: state.district, name: text };
    await ctx.reply('Пожалуйста, напишите ваш номер телефона:');
    return;
  }
  if (state && state.step === 'phone') {
    const collected = {
      service: state.service,
      budget: state.budget,
      district: state.district,
      name: state.name,
      phone: text,
    };
    let msg = `Новая заявка:\nУслуга: ${collected.service}`;
    if (collected.budget) msg += `\nБюджет: ${collected.budget}`;
    if (collected.district) msg += `\nРайон: ${collected.district}`;
    msg += `\nИмя: ${collected.name}\nТелефон: ${collected.phone}\n@${user.username || user.first_name} (${user.id})`;
    // Send to admin with approval buttons
    await ctx.telegram.sendMessage(ADMIN_CHAT_ID, msg, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Одобрить и отправить агенту', callback_data: `approve:${user.id}` },
            { text: '❌ Отклонить', callback_data: `reject:${user.id}` }
          ]
        ]
      }
    });
    await ctx.reply('Спасибо! Ваша заявка отправлена администратору на рассмотрение.', mainMenu);
    delete userStates[user.id];
    return;
  }

  // Default: old behavior
  const msg = `New message from @${user.username || user.first_name} (${user.id}):\n${text}`;
  // Send to admin with approval buttons
  await ctx.telegram.sendMessage(ADMIN_CHAT_ID, msg, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Одобрить и отправить агенту', callback_data: `approve:${user.id}` },
          { text: '❌ Отклонить', callback_data: `reject:${user.id}` }
        ]
      ]
    }
  });
  await ctx.reply('Спасибо! Ваше сообщение отправлено администратору на рассмотрение.', mainMenu);
});


// Handle admin approval callback with FORWARD_TO_AGENT modes
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  const message = ctx.callbackQuery.message;
  if (!data) return;
  if (data.startsWith('approve:')) {
    // Forwarding logic
    if (config.FORWARD_TO_AGENT === 'all') {
      await ctx.telegram.sendMessage(config.AGENT_CHAT_ID, message.text);
      await ctx.answerCbQuery('Заявка отправлена агенту.');
    } else if (config.FORWARD_TO_AGENT === 'ask') {
      // Prompt admin to confirm forwarding
      await ctx.telegram.sendMessage(config.ADMIN_CHAT_ID, 'Forward this to agent?', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '➡️ Forward to Agent', callback_data: `forward_agent:${data.split(':')[1]}` },
              { text: '🚫 Do Not Forward', callback_data: `no_forward:${data.split(':')[1]}` }
            ]
          ]
        }
      });
      await ctx.answerCbQuery('Ожидает подтверждения для отправки агенту.');
    } else {
      // 'no' mode
      await ctx.answerCbQuery('Заявка одобрена, но не отправлена агенту.');
    }
    await ctx.editMessageReplyMarkup(); // Remove inline buttons
  } else if (data.startsWith('reject:')) {
    await ctx.answerCbQuery('Заявка отклонена.');
    await ctx.editMessageReplyMarkup(); // Remove inline buttons
  } else if (data.startsWith('forward_agent:')) {
    // Actually forward to agent
    await ctx.telegram.sendMessage(config.AGENT_CHAT_ID, message.text);
    await ctx.answerCbQuery('Заявка отправлена агенту.');
    await ctx.editMessageReplyMarkup();
  } else if (data.startsWith('no_forward:')) {
    await ctx.answerCbQuery('Заявка не отправлена агенту.');
    await ctx.editMessageReplyMarkup();
  }
});

bot.launch();
console.log('Bot started.');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


const { Telegraf } = require('telegraf');
const config = require('./config');

if (!config.BOT_TOKEN || !config.ADMIN_CHAT_ID || !config.AGENT_CHAT_ID) {
  console.error('Missing BOT_TOKEN, ADMIN_CHAT_ID, or AGENT_CHAT_ID in .env');
  process.exit(1);
}

const bot = new Telegraf(config.BOT_TOKEN);

const userStates = {};

const mainMenu = {
  reply_markup: {
    keyboard: [
      [config.BUTTONS.SERVICE_LIST, config.BUTTONS.CONTACT],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

const serviceMenu = {
  reply_markup: {
    keyboard: Object.values(config.SERVICES).map((s) => [s]),
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




bot.hears(config.BUTTONS.SERVICE_LIST, async (ctx) => {
  userStates[ctx.from.id] = { step: 'service' };
  await ctx.reply(config.STRINGS.CHOOSE_SERVICE, serviceMenu);
});

bot.hears(config.BUTTONS.CONTACT, async (ctx) => {
  await ctx.reply(config.STRINGS.CONTACT_PROMPT, mainMenu);
});



bot.on('message', async (ctx) => {
  const user = ctx.from;
  const text = ctx.message.text || '[non-text message]';
  // Do not duplicate notifications for menu buttons

  if ([config.BUTTONS.SERVICE_LIST, config.BUTTONS.CONTACT].includes(text)) return;

  // Step-by-step flow (generic, data-driven)
  const state = userStates[user.id];
  const flow = config.STRINGS.FLOW;
  if (state && state.step === 'service') {
    // SERVICES is now an object: { key: label }
    const serviceKey = Object.keys(config.SERVICES).find(key => config.SERVICES[key] === text);
    if (!serviceKey) {
      await ctx.reply(config.STRINGS.INVALID_SERVICE, serviceMenu);
      return;
    }
    // If service is buy or rent, start flow
    if (serviceKey === 'buy' || serviceKey === 'rent') {
      userStates[user.id] = { step: flow[0].field, service: serviceKey };
      await ctx.reply(flow[0].prompt);
      return;
    }
    // Otherwise, skip to next relevant step (e.g., name)
    userStates[user.id] = { step: flow[2].field, service: serviceKey };
    await ctx.reply(flow[2].prompt);
    return;
  }
  // Generic step handler
  if (state && flow.some(f => f.field === state.step)) {
    const idx = flow.findIndex(f => f.field === state.step);
    const nextStep = flow[idx + 1];
    // Build up state
    userStates[user.id] = { ...state, [state.step]: text };
    if (nextStep) {
      userStates[user.id].step = nextStep.field;
      await ctx.reply(nextStep.prompt);
      return;
    } else {
      // All steps complete, send lead
      const collected = { service: state.service };
      for (const f of flow) collected[f.field] = userStates[user.id][f.field] || text;
      await ctx.telegram.sendMessage(
        ADMIN_CHAT_ID,
        config.STRINGS.LEAD_TEMPLATE(collected, user),
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: config.STRINGS.APPROVE_BTN, callback_data: `approve:${user.id}` },
                { text: config.STRINGS.REJECT_BTN, callback_data: `reject:${user.id}` }
              ]
            ]
          }
        }
      );
      await ctx.reply(config.STRINGS.LEAD_SENT, mainMenu);
      delete userStates[user.id];
      return;
    }
  }

  // Default: old behavior
  // Send to admin with approval buttons
  await ctx.telegram.sendMessage(
    ADMIN_CHAT_ID,
    config.STRINGS.MSG_TEMPLATE(user, text),
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: config.STRINGS.APPROVE_BTN, callback_data: `approve:${user.id}` },
            { text: config.STRINGS.REJECT_BTN, callback_data: `reject:${user.id}` }
          ]
        ]
      }
    }
  );
  await ctx.reply(config.STRINGS.MSG_SENT, mainMenu);
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
      await ctx.telegram.sendMessage(config.ADMIN_CHAT_ID, config.STRINGS.FORWARD_PROMPT, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: config.STRINGS.FORWARD_BTN, callback_data: `forward_agent:${data.split(':')[1]}` },
              { text: config.STRINGS.NO_FORWARD_BTN, callback_data: `no_forward:${data.split(':')[1]}` }
            ]
          ]
        }
      });
      await ctx.answerCbQuery(config.STRINGS.WAITING_FORWARD_CONFIRM);
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

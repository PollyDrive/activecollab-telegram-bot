const Telegraf = require('telegraf')

const BOT_TOKEN = '746952239:AAHabzbXa1aje-n1L_tzxkUp3TjsZVfbmGA';

const bot = new Telegraf(BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.startPolling()

// const bot = new Telegraf(BOT_TOKEN)

// bot.use((ctx, next) => {
//   const start = new Date()
//   return next(ctx).then(() => {
//     const ms = new Date() - start
//     console.log('Response time %sms', ms)
//   })
// })

// bot.on('text', (ctx) => ctx.reply('Hello World'))
// bot.startPolling()
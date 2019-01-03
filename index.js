require('dotenv').config()
// const getIntent = require('./api.js')
const api = require('./api.js')
const Telegraf = require('telegraf')

let intent = ''
let token = ''

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => {
  console.log('send request to collab')
  ctx.reply('Hey there')
})

bot.command('api', (ctx) => {
  ctx.reply('Api')
  api.getIntent()
})

bot.command('projects', (ctx) => {
  ctx.reply('projects')
  api.getProjects()
})

// console.log(process.env.BOT_TOKEN)


// bot.use((ctx) => {
//   console.log(ctx.telegram)
//   console.log(ctx.chat)
// })





// bot.use((ctx, next) => {
//   const start = new Date()
//   return next(ctx).then(() => {
//     const ms = new Date() - start
//     console.log('Response time %sms', ms)
//   })
// })

bot.on('text', (ctx) => ctx.reply('Hello World'))

bot.startPolling()
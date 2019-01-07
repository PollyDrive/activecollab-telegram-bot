require('dotenv').config()
// const getIntent = require('./api.js')
const api = require('./api.js')
const Telegraf = require('telegraf')

let lastCommand = []


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => {
  console.log('send request to collab')
  ctx.reply('Hey there')
})


api.checkToken()

bot.command('api', (ctx) => {
  api.getIntent()
})

bot.command('projects', (ctx) => {
  
  api.getProjects().then(function (filteredMsg) {

    ctx.reply(filteredMsg)
  }).catch(function (e) {

  })

})


bot.command('tasks', (ctx) => {
  lastCommand[ctx.message.from.id] = 'tasks'
  ctx.reply('Введи id проекта')
})



bot.on('text', (ctx) => {
  if (lastCommand[ctx.message.from.id] === 'tasks') {

    ctx.reply(`Ща будут таски по проекту ${ctx.message.text}`)
    api.getTasks(ctx.message.text).then(function (taskArr) {
      // console.log(taskArr)
      ctx.reply(taskArr)
    }).catch(function (e) {
    })


  } else { 
    ctx.reply('Давай еще раз')
  }
})

bot.startPolling()
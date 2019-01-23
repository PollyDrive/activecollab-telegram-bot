
require('dotenv').config()
const server = require('./server.js')
const apiCollab = require('./handlers/apiCollab.js')
const apiTeamweek = require('./handlers/apiTeamweek.js')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const TelegrafInlineMenu = require('telegraf-inline-menu')

// let lastCommand = []



/********[START EXPRESS]*******/
server();

/********[INIT TOKEN COLLAB]*******/
apiCollab.checkToken()

const menu = new TelegrafInlineMenu(
  ctx => `Hey ${ctx.from.first_name}!`
)
menu.simpleButton('I am excited!', 'a', {
  doFunc: ctx => ctx.reply('As am I!')
})

menu.setCommand('start')
  
/********[INIT PROJECTS]*******/

// bot.command('projects', (ctx) => {
//   // projectsController()
// })

/********[INIT TASKS]*******/

/********[INIT TIME RECORDS]*******/

/********[INIT SETTINGS]*******/

/********[RUNTIME]*******/
    
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('user', (ctx) => { 
  apiTeamweek.getUser().then(function (res) {
    // console.log(res);
    ctx.reply(`Hello, ${res.name}! \n your id: ${res.userID} `)
    apiTeamweek.getTaskList(res.workspaceID).then(function (resArr) {
      console.log(resArr);
      // ctx.reply(resArr);
      ctx.reply('Вот твои таски', Markup
        .keyboard(resArr)
        .oneTime()
        .resize()
        .extra()
      )
      

    }).catch(function (e) {
      console.log(e);
    })

  }).catch(function (err) {
    console.log(err);
  })
})



bot.command('projects', (ctx) => {
  ctx.reply(`Ищу твои проекты `)
  apiCollab.getProjects().then(function (filteredMsg) {

    let keyboardArray = [];
    filteredMsg.forEach((item) => {
      keyboardArray.push(item.name);
    });

    ctx.reply('Твои проекты', Markup
      .inlineKeyboard([keyboardArray])
    )
    console.log(keyboardArray)

    ctx.reply('Твои проекты', Markup
      .keyboard(keyboardArray)
      .oneTime()
      .resize()
      .extra()
    )

    let selectedItem = {}

    function predicateFn(callbackData) {
      let isPredicate = false;
      filteredMsg.forEach((item) => {
        if (item.name === callbackData) isPredicate = true, selectedItem = item
      })
      return isPredicate;
    }

    bot.hears(predicateFn, (ctx) => {
      const filteredSelectedItem = filteredMsg.filter(function (item) {
        return item.name === selectedItem.name;
      })
      ctx.reply('ты выбрал проект: ' + filteredSelectedItem[0].name);
      apiCollab.getTasks(filteredSelectedItem[0].id).then(function (taskArr) {
        
        if (taskArr.length) {
          // console.log(taskArr)
          let filteredTaskArr = []
          taskArr.forEach((item) => {
            filteredTaskArr.push(item.name)
          })

          ctx.reply('Вот твои таски', Markup
            .keyboard(filteredTaskArr)
            .oneTime()
            .resize()
            .extra()
          )


          apiCollab.timeRecord(1, 1).then(function (res) {
            console.log(res)
          }).catch(function (e) {
            console.log(e)
          })

        } else {
          ctx.reply('Тасков нет, иди домой')
        }
      }).catch(function (e) {})
    });
 
  }).catch(function (e) {
    console.log(e)
  })
})

// menu.simpleButton('I am excited!', 'a', {
//   doFunc: ctx => ctx.reply('As am I!')
// })
// menu.setCommand('olo')
// bot.use(main.init())



bot.startPolling()
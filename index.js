require('dotenv').config()
// const getIntent = require('./apiCollab.js')
const apiCollab = require('./handlers/apiCollab.js')
const apiTeamweek = require('./handlers/apiTeamweek.js')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')


// let lastCommand = []


const bot = new Telegraf(process.env.BOT_TOKEN)


/********[WELCOME]*******/
bot.start((ctx) => ctx.reply('Welcome'))

/********[INIT HELP]*******/
bot.help((ctx) => ctx.reply('тут будет хэлба'))

/********[INIT TOKEN COLLAB]*******/
apiCollab.checkToken(app)


/********[INIT TOKEN TEAM WEAK]*******/
// apiTeamweek.firstStep()

/********[INIT PROJECTS]*******/
// bot.command('projects', (ctx) => {
//   // projectsController()


//   // ЕБОШЬ

// })


var express = require('express');
var app = express();



app.get('/auth', function (req, res) {
  const redirectURI = apiTeamweek.generateAuthUri()
  res.redirect(redirectURI);
});

app.get('/callback', function (req, res) {
  res.send(req.query.code);
  console.log(req.query.code)
  
  apiTeamweek.getToken(req.query.code).then(function (res) {
    console.log(res)
  }).catch(function (err) {
    console.log(err)
  })
});



app.listen(3000, function () {
  console.log('app listening on port 3000!');
});


bot.command('projects', (ctx) => {
  ctx.reply(`Ищу твои проекты `)
  apiCollab.getProjects().then(function (filteredMsg) {

    let keyboardArray = [];
    filteredMsg.forEach((item) => {
      keyboardArray.push(item.name);
    });

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
              // console.log(res)
            
          }).catch(function (e) {

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

/********[INIT TASKS]*******/
// bot.command('tasks', (ctx) => {
//   lastCommand[ctx.message.from.id] = 'tasks'
//   ctx.reply('Введи id проекта')
// })


/********[INIT TIME RECORDS]*******/


/********[INIT SETTINGS]*******/


/********[RUNTIME]*******/




// bot.on('text', (ctx) => {
//   if (lastCommand[ctx.message.from.id] === 'tasks') {
//     ctx.reply(`Ищу таски по проекту ${ctx.message.text}`)
//     apiCollab.getTasks(ctx.message.text).then(function (taskArr) {
//       // console.log(taskArr)
//       if (taskArr.length) {
//         ctx.reply('Вот твои таски', Markup
//           .keyboard(
//             [taskArr]
//             )
//             .oneTime()
//             .resize()
//             .extra()
//           )
//       } else { 
//         ctx.reply('Тасков нет')
//       }
//     }).catch(function (e) {
//     })

//   } else { 
//     ctx.reply('Давай еще раз')
//   }
// })




bot.startPolling()
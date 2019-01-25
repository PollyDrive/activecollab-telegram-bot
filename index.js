
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

// menu.setCommand('start')
  
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
      // console.log(resArr);
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


function convertTime(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  // var hour = a.getHours();
  // var min = a.getMinutes();
  // var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ';

  // допилить вывод для даты + время
  return time;
}

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
      // ctx.reply('ты выбрал проект: ' + filteredSelectedItem[0].name);

      apiCollab.getTasks(filteredSelectedItem[0].id).then(function (taskArr) {
        
        if (taskArr.length) {
          // console.log(taskArr)
          let filteredTaskArr = []
          taskArr.forEach((item, index) => {
            // console.log(item);
            const task = {
              id: item.id,
              name: item.name,
              body: item.body,
              task_list_id: item.task_list_id,
              url: item.url_path,
              label: item.label,
              job_type_id: item.job_type_id,
              assignee_id: item.assignee_id,
              estimate: item.estimate / 60,
              start_on: item.start_on,
              due_on: item.due_on,
              is_completed: item.is_completed,
            }
            filteredTaskArr.push(task)
            
          })

          const buttonsObj = {
            reply_markup: JSON.stringify({
              inline_keyboard: filteredTaskArr.map((item) => ([{
                text: item.name,
                callback_data: item.url,
              }])),
            }),
          };
          
          let answerObj = {}
          ctx.reply('project tasks:', buttonsObj).then(() => {
            answerObj = JSON.parse(buttonsObj.reply_markup).inline_keyboard[0][0];
            // console.log(answerObj)

            bot.action(answerObj.callback_data, (ctx) => {

              const actionsMenu = Telegraf.Extra
                .markdown()
                .markup((m) => m.inlineKeyboard([
                  m.callbackButton('Открыть таск', 'open_task'),
                  m.callbackButton('Трекнуть время', 'track_time')
                ]));
              
              ctx.reply('че хочешь?', actionsMenu).then(() => {
                const selectedTask = filteredTaskArr.filter(function (item) {
                  return item.url === answerObj.callback_data
                })

                bot.action('open_task', (ctx) => {
                  // console.log(selectedTask.url)
                  const thisItem = {
                    name: selectedTask[0].name,
                    body: selectedTask[0].body ? selectedTask[0].body : 'описания нет',
                    estimate: selectedTask[0].estimate ? 'запланировано ' + selectedTask[0].estimate + ' ч.' : 'ожидаемого времени нет',
                    due_on: selectedTask[0].due_on ? 'надо выполнить до ' + convertTime(selectedTask[0].due_on) : 'делай сколько хочешь'
                  }

                  ctx.reply(`
                    ${thisItem.name}, \n ${thisItem.body}, \n ${thisItem.estimate}, ${thisItem.due_on}
                  `)
                });
                bot.action('track_time', (ctx) => {
                  ctx.reply('сколько часов трекнуть?')
                  // apiCollab.timeRecord(1, 1).then(function (res) {
                  //   // console.log(res)
                      // bot.action(item.name, (ctx) => ctx.answerCallbackQuery('Трекнул!'))
                  // }).catch(function (e) {
                  //   console.log(e)
                  // })
                });

              }).catch((e) => {
                console.log(e)
              })
            })
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


bot.startPolling()
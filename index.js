
require('dotenv').config()
const server = require('./server.js')
const apiCollab = require('./handlers/apiCollab.js')
const collabTasks = require('./handlers/collabTasks.js')
const apiTeamweek = require('./handlers/apiTeamweek.js')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const TelegrafInlineMenu = require('telegraf-inline-menu')

// let lastCommand = []



/********[START EXPRESS]*******/
server();

/********[INIT TOKEN COLLAB]*******/
apiCollab.checkToken()
    
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



let selectedItem = {}
let selectedArr = []
let currentAction = ''

function predicateFn(callbackData) {
  let isPredicate = false;
  selectedArr.forEach((item) => {
    if (item.name === callbackData) isPredicate = true, selectedItem = item
  })
  return isPredicate
}





bot.hears(predicateFn, (ctx) => {

  if (currentAction === 'projects') {

    const filteredSelectedItem = selectedArr.filter(function (item) {
      return item.name === selectedItem.name;
    })

    let filteredListArr = []

    apiCollab.getProjectList(filteredSelectedItem[0].id).then(function (listArr) {

      if (listArr.length) {
        listArr.forEach((item) => {
          const list = {
            list_id: item.id,
            list_url_path: item.url_path,
            name: item.name,
            list_project_id: item.project_id,
            list_open_tasks: item.open_tasks,
            list_completed_tasks: item.completed_tasks
          }
          filteredListArr.push(list)

        })
      }

      let keyboardListArray = [];
      filteredListArr.forEach((item) => {
        keyboardListArray.push(item.name);
      });

      ctx.reply('Выбери список', Markup
        .keyboard([
          [keyboardListArray[0], keyboardListArray[1], keyboardListArray[2]],
          [keyboardListArray[3], keyboardListArray[4]],
          [keyboardListArray[5], keyboardListArray[6]]
        ])
        .oneTime(true)
        .resize(true)
        .extra()
      )

      selectedArr = filteredListArr
      currentAction = 'project-lists'

    });



  } else if (currentAction === 'project-lists') {

    const filteredSelectedItem = selectedArr.filter(function (item) {
      return item.name === selectedItem.name;
    })

    ctx.reply(filteredSelectedItem)
    // в это же время получаем таски всег проекта, т.к. нет возможности выбирать таски по спискам
    collabTasks.getCollabTasks(filteredSelectedItem[0].id)


  }

})





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
      .resize(true)
      .extra()
    )

    selectedArr = filteredMsg
    currentAction = 'projects'
 
  }).catch(function (e) {
    console.log(e)
  })
})


bot.startPolling()

require('dotenv').config()
const server = require('./server.js')
const helpers = require('./helpers.js')
const { Button } = require('./buttons.js')
const apiCollab = require('./handlers/apiCollab.js')
const apiTeamweek = require('./handlers/apiTeamweek.js')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
// const TelegrafInlineMenu = require('telegraf-inline-menu')


/********[START EXPRESS]*******/
server();
/********[HELPERS INIT]*******/


/********[INIT TOKEN COLLAB]*******/
apiCollab.checkToken()

let selectedItem = {}
let selectedArr = []
let currentAction = ''


const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('user', (ctx) => { 
  apiTeamweek.getUser().then(function (res) {
    ctx.reply(`Hello, ${res.name}! \n your id: ${res.userID} `)
    apiTeamweek.getTaskList(res.workspaceID).then(function (resArr) {
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

    let filteredTaskArr = []

    const filteredSelectedItem = selectedArr.filter(function (item) {
      return item.name === selectedItem.name;
    })

    // console.log(filteredSelectedItem[0].name)

    apiCollab.getTasks(filteredSelectedItem[0].list_project_id).then(function (taskArr) {
      // console.log(taskArr)

      if (taskArr.length) {
        taskArr.forEach((item) => {

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
          //- таски всего проекта
        })


        //- только те таски, которые есть в выбранном списке
        const taskByListArr = filteredTaskArr.filter((item) => {
          return item.task_list_id === filteredSelectedItem[0].list_id
        })
        
        // console.log(taskByListArr)

        if (taskByListArr.length) {
          const taskButtons = new Button('project tasks:', taskByListArr, true)
          taskButtons.createInlineButtons()
        }

        // const buttonsObj = {
        //   reply_markup: JSON.stringify({
        //     inline_keyboard: taskByListArr.map((item) => ([{
        //       text: item.name,
        //       callback_data: item.url,
        //     }])),
        //   }),
        // };

        // let answerObj = {}
        // ctx.reply('project tasks:', buttonsObj).then(() => {
        //   answerObj = JSON.parse(buttonsObj.reply_markup).inline_keyboard[0][0];
        //   // console.log(answerObj)

        //   bot.action(answerObj.callback_data, (ctx) => {
        //     console.log(answerObj.callback_data)
        //     const actionsMenu = Telegraf.Extra
        //       .markdown()
        //       .markup((m) => m.inlineKeyboard([
        //         m.callbackButton('Открыть таск', 'open_task'),
        //         m.callbackButton('Трекнуть время', 'track_time')
        //       ]));

        //     ctx.reply('че хочешь?', actionsMenu).then(() => {
        //       const selectedTask = filteredTaskArr.filter(function (item) {
        //         return item.url === answerObj.callback_data
        //       })

        //       bot.action('open_task', (ctx) => {
        //         // console.log(selectedTask.url)
        //         const thisItem = {
        //           name: selectedTask[0].name,
        //           body: selectedTask[0].body ? selectedTask[0].body : 'описания нет',
        //           estimate: selectedTask[0].estimate ? 'запланировано ' + selectedTask[0].estimate + ' ч.' : 'ожидаемого времени нет',
        //           due_on: selectedTask[0].due_on ? 'надо выполнить до ' + helpers.convertTime(selectedTask[0].due_on) : 'делай сколько хочешь'
        //         }

        //         ctx.reply(`
        //           ${thisItem.name}, \n ${thisItem.body}, \n ${thisItem.estimate}, ${thisItem.due_on}
        //         `)
        //       });
        //       bot.action('track_time', (ctx) => {
        //         ctx.reply('сколько часов трекнуть?')
        //         // apiCollab.timeRecord(1, 1).then(function (res) {
        //         //   // console.log(res)
        //         // bot.action(item.name, (ctx) => ctx.answerCallbackQuery('Трекнул!'))
        //         // }).catch(function (e) {
        //         //   console.log(e)
        //         // })
        //       });
        //       // selectedArr = filteredTaskArr
        //       // currentAction = 'project-tasks'

        //     }).catch((e) => {
        //       console.log(e)
        //     })
        //   })
        // }).catch(function (e) {
        //   console.log(e)
        // })


      } else {
        ctx.reply('Тасков нет, иди домой')
      }
    }).catch(function (e) {})

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
      .resize()
      .extra()
    )

    selectedArr = filteredMsg
    currentAction = 'projects'

    //-  bot will be listen all currentAction from now
 
  }).catch(function (e) {
    console.log(e)
  })



})


bot.startPolling()
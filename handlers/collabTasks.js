require('dotenv').config()
const apiCollab = require('./apiCollab.js')


function getCollabTasks(projectID) {


  apiCollab.getTasks(projectID).then(function (taskArr) {

      if (taskArr.length) {
        // console.log(taskArr)
        let filteredTaskArr = []
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
          console.log(answerObj)

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
  }).catch(function (e) { })

}
module.exports = {
  getCollabTasks
}
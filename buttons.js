class Button {
  constructor(replyText, allAnswersArr, nextAction) {
    this.replyText = replyText;  // optional
    this.allAnswersArr = allAnswersArr
    this.nextAction = nextAction
  }
  
  createInlineButtons() {
    console.log(this)
    return buttonsObj = {
      reply_markup: JSON.stringify({
        inline_keyboard: this.allAnswersArr.map((item) => ([{
          text: item.name,
          callback_data: item.url,
        }])),
      }),
    }
  }

  reply() {
    let createdButtonObj = this.createInlineButtons()
    console.log(createdButtonObj)
    let answerObj = {}
    ctx.reply(this.replyText, buttonsObj).then(() => {
      answerObj = JSON.parse(buttonsObj.reply_markup).inline_keyboard[0][0];
      bot.action(answerObj.callback_data, (ctx) => {
        console.log('callback_data: ' + answerObj.callback_data)
  
        if (this.nextAction) {
          // nextAction()
          // вызывать еще раз?
          console.log('следующий вызов')

        } else {
          console.log('callback_data is: ' + answerObj.callback_data)
          return answerObj.callback_data
        }
      })
    }).catch(function (e) {
        console.log(e)
      })
  }
      
}

        // const actionsMenu = Telegraf.Extra
        //   .markdown()
        //   .markup((m) => m.inlineKeyboard([
        //     m.callbackButton('Открыть таск', 'open_task'),
        //     m.callbackButton('Трекнуть время', 'track_time')
        //   ]));

        // ctx.reply('че хочешь?', actionsMenu).then(() => {
        //   const selectedTask = filteredTaskArr.filter(function (item) {
        //     return item.url === answerObj.callback_data
        //   })

        //   bot.action('open_task', (ctx) => {
        //     const thisItem = {
        //       name: selectedTask[0].name,
        //       body: selectedTask[0].body ? selectedTask[0].body : 'описания нет',
        //       estimate: selectedTask[0].estimate ? 'запланировано ' + selectedTask[0].estimate + ' ч.' : 'ожидаемого времени нет',
        //       due_on: selectedTask[0].due_on ? 'надо выполнить до ' + helpers.convertTime(selectedTask[0].due_on) : 'делай сколько хочешь'
        //     }
        //     ctx.reply(`${thisItem.name}, \n ${thisItem.body}, \n ${thisItem.estimate}, ${thisItem.due_on}`)
        //   });



          // bot.action('track_time', (ctx) => {
          //   ctx.reply('сколько часов трекнуть?')
            // apiCollab.timeRecord(1, 1).then(function (res) {
            //   // console.log(res)
            // bot.action(item.name, (ctx) => ctx.answerCallbackQuery('Трекнул!'))
            // }).catch(function (e) {
            //   console.log(e)
            // })
          // });
          // selectedArr = filteredTaskArr
          // currentAction = 'project-tasks'

      //   }).catch((e) => {
      //     console.log(e)
      //   })
      // })

  
  // createAnswer() {
  //   if (this.keyboard === 'inline') {
      
  //     const menu = Telegraf.Extra.markdown().markup((m) => m.inlineKeyboard([
  //       m.callbackButton('Test button', 'test')
  //     ]))
      
  //     bot.hears('test', (ctx) => {
  //       ctx.reply(menu, this.mgsText).then(() => {
  //         ctx.reply('about', menu)
  //       })
  //     })

  //     bot.action('test', (ctx) => ctx.answerCbQuery('Yay!'))
      
  //   } else {
  //     //
  //   }
  // }

module.exports = { Button }

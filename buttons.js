class Button {
  constructor(keyboard) {
    this.keyboard = keyboard; 
    this.mgsText = mgsText;  // optional
    this.answerArr = answerArr
  }

  // predicateFn(callbackData) {
  //   let isPredicate = false;
  //   answerArr.forEach((item) => {
  //     if (item.name === callbackData) isPredicate = true, selectedItem = item
  //   })
  //   return isPredicate;
  // }

  
  
  createAnswer() {
    if (this.keyboard === 'inline') {
      
      const menu = Telegraf.Extra.markdown().markup((m) => m.inlineKeyboard([
        m.callbackButton('Test button', 'test')
      ]))
      
      bot.hears('test', (ctx) => {
        ctx.reply(menu, this.mgsText).then(() => {
          ctx.reply('about', menu)
        })
      })

      bot.action('test', (ctx) => ctx.answerCbQuery('Yay!'))
      
    } else {
      //
    }
  }

}

/*
Передавать массив кнопок с функциями
*/
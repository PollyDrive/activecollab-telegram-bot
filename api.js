let token = ''
let isTokenRequest = false
const request = require('request');


function req(method, someUrl, body) {

  return new Promise(function (resolve, reject) {

    request[method](someUrl, {
      json: true,
      body: body,
      headers: token && !isTokenRequest ? {
        'X-Angie-AuthApiToken': token
      } : null
    }, function (err, res) { 
        
        if (!isTokenRequest) {
          checkToken(res)
        } else {
          isTokenRequest = false
        }

        if (err) return reject(err);
        console.log('******* start responce **********')
        resolve(res.body);
        
    })

  })
  
}

function checkToken(res) {
  if ((res && res.body && res.body.message && res.body.message === 'Authorization token is not valid') || token === '') {
    getIntent()
    console.log('получаем новый токен')
  }
}



function getIntent() {
  isTokenRequest = true
  req('post', process.env.API_URL_LOGIN, {
    email: 'arslan-cs@ya.ru',
    password: 'arslan5424'
  }).then(function (body) {
    getToken(body)
    
  }).catch(function (err) {
    console.log(err)
  })
}

function getToken(body) {
  isTokenRequest = true
  req('post', process.env.API_URL + '/?format=json&path_info=%2Fissue-token-intent', {
    intent: body.user.intent,
    client_name: 'penkman',
    client_vendor: 'telegram_bot',
  }).then(function (res) {
    token = res.token
    console.log(res.token)
  }).catch(function (err) {
    console.log(err)
  })
}

function getProjects() {
  return new Promise(function (resolve, reject) {
    req('get', process.env.API_URL + '/projects').then(function (res) {
      let filteredMsg = ''

      res.forEach((item, index) => {
        filteredMsg += '\nid: ' + item.id + ' ' + 'name: ' + item.name
      })
      resolve(filteredMsg)

    }).catch(function (err) {
      reject(err)
    })
  })
}

// получить список листов /task-lists or /task-lists/{id}
// получить список тасков /tasks or /tasks/{id}

function getTasks(id) {
  return new Promise(function (resolve, reject) {
    req('get', `${process.env.API_URL}/projects/${id}/tasks`).then(function (res) {

      let taskArr = []
      
      res.tasks.forEach((item, index) => {
        console.log(item)
        taskArr.push(item.name)
      })

      resolve(taskArr)

    }).catch(function (err) {
      reject(err)
    })
  })
}


// module.exports = req
module.exports = {
  getIntent,
  getProjects,
  checkToken,
  getTasks
} 

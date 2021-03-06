let token = ''
let isTokenRequest = false
const request = require('request');

let count = 0;

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
        count++
        console.log(`******* responce № ${count} **********`)
        resolve(res.body);
        
    })

  })
  
}

function checkToken(res) {
  if ((res && res.body && res.body.message && res.body.message === 'Authorization token is not valid') || token === '') {
    getIntent()
    console.log('get collab token')
  }
}


function getIntent() {
  isTokenRequest = true
  req('post', process.env.API_URL_LOGIN, {
    email: 'pollydrive42@gmail.com',
    password: 'pinkmanfront'
  }).then(function (body) {
    // console.log('user.intent is: ' + body.user.intent)
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

    console.log('collab token is: ' + res.token)
    token = res.token
  }).catch(function (err) {
    console.log(err)
  })
}

function getProjects() {
  return new Promise(function (resolve, reject) {
    req('get', process.env.API_URL + '/projects').then(function (res) {
      // let filteredMsg = ''
      let filteredArr = []
      // console.log(res)

      res.forEach((item, index) => {
        filteredArr.push({
          id: item.id,
          name: item.name
        })
      })
      
      resolve(filteredArr)

    }).catch(function (err) {
      reject(err)
    })
  })
}

function getProjectList(projectID) {
  return new Promise(function (resolve, reject) {
    req('get', process.env.API_URL + `/projects/${projectID}/task-lists`).then(function (res) {
      // let filteredMsg = ''

      let filteredArr = []
      // console.log(res)

      res.forEach((item, index) => {
        filteredArr.push(item)
      })
      
      resolve(filteredArr)

    }).catch(function (err) {
      reject(err)
    })
  })
}



function getTasks(projectID) {
  return new Promise(function (resolve, reject) {
    req('get', `${process.env.API_URL}/projects/${projectID}/tasks`).then(function (res) {

      let taskArr = []
      
      res.tasks.forEach((item, index) => {
        // console.log(item)
        taskArr.push(item)
      })

      resolve(taskArr)

    }).catch(function (err) {
      reject(err)
    })
  })
}


function timeRecord(projectID, taskID) {
  return new Promise(function (resolve, reject) {
    req('post', `${process.env.API_URL}/projects/${projectID}/time-records`, {
      task_id: taskID,
      value: "2:30",
      user_id: 1,
      job_type_id: 1,
      record_date: "2019-01-14",
      billable_status: 1
    }).then(function (res) {

      resolve(res)

    }).catch(function (err) {
      reject(err)
    })
  })
}


// module.exports = req
module.exports = {
  getIntent,
  checkToken,
  getProjects,
  getProjectList,
  getTasks,
  timeRecord
} 

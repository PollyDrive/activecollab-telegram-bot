let token = ''

function req(method, someUrl, body, callback = null) {
  var request = require('request');
  request[method](someUrl, {
    json: true,
    body: body,
    headers: token ? {
      'X-Angie-AuthApiToken': token
    } : null
  }, function (err, res) {
    if (callback) {
      callback(res.body, err)
      
    }
  });
}

function getIntent() {
  req('post', process.env.API_URL_LOGIN, {
    email: 'arslan-cs@ya.ru',
    password: 'arslan5424'
  }, getToken)
}

function getToken(body, err) {
  req('post', process.env.API_URL + '/?format=json&path_info=%2Fissue-token-intent', {
    intent: body.user.intent,
    client_name: 'penkman',
    client_vendor: 'telegram_bot',
  },
  function (body, err) {
    console.log(body, err)
    token = body.token
  })
}

function getProjects() {
  console.log('sgs')

  req('get', process.env.API_URL + '/projects', null, function (body, err) {
    console.log(body, err)
  })
}

// module.exports = req
module.exports = {
  getIntent,
  getProjects
} 

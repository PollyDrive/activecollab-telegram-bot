//

const request = require('request');


const credentials = {
  client: {
    id: '310138d23f7b2108672b',
    secret: 'a7bc9abb82a3f62d3f8276ebfd38da803df37962'
  },
  auth: {
    tokenHost: 'https://teamweek.com/',
    tokenPath: 'oauth/login',
    authorizeHost: 'https://teamweek.com/api/v4/',
    authorizePath: 'authenticate/token'
  }
};

function req(method, someUrl, body) {

  const base64 = new Buffer.from(credentials.client.id + ':' + credentials.client.secret).toString('base64')
  console.log('base64: ' + 'Basic' + base64)

  return new Promise(function (resolve, reject) {

    request[method](someUrl, {
      json: true,
      body: body,
      headers: {
        'Authorization': 'Basic' + base64 
      }
    }, function (err, res) {

      if (err) return reject(err);
      
      resolve(res.body);

    })

  })

}


function generateAuthUri() {

  // const oauth2 = require('simple-oauth2').create(credentials);

  // const authorizationUri = oauth2.authorizationCode.authorizeURL({
  //   redirect_uri: 'http://pinkman.ru/',
  //   // scope: 'scope', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
  //   state: 'asdasd1323123dasdasd'
  // });

  const authorizationUri = 'https://teamweek.com/oauth/login?response_type=code&client_id=' + credentials.client.id + '&redirect_uri=http://localhost:3000/callback'
  return authorizationUri;

}

function getToken(authCode) {
  return new Promise(function (resolve, reject) {
    req('post', 'https://teamweek.com/api/v4/authenticate/token', {
      grant_type: 'authorization_code',
      code: authCode,
      client_id: credentials.client.id
    }).then(function (res) {
      resolve(res)
    }).catch(function (e) {
      //
    })
  })
}

// Save the access token
// try {
//   const result = await oauth2.authorizationCode.getToken(tokenConfig)
//   const accessToken = oauth2.accessToken.create(result);
// } catch (error) {
//   console.log('Access Token Error', error.message);
// }

// // Get the access token object.
// const tokenConfig = {
//   username: 'pollydrive42@gmail.com',
//   password: 'pinkmanfr0nt',
//   scope: '<scope>', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
// };

// // Save the access token
// try {
//   const result = await oauth2.ownerPassword.getToken(tokenConfig);
//   const accessToken = oauth2.accessToken.create(result);
//   console.log(accessToken)
// } catch (error) {
//   console.log('Access Token Error', error.message);
// }

module.exports = {
  generateAuthUri,
  getToken
}
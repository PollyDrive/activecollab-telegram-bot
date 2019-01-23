//

const request = require('request');
let access_token = 'IYLVeHpYx52JkiZKeUw5l7wqoxDww6hOE4NJJoSZ3A-E1sNarYEhxBeOPPg4F4hYBHN2G8l7knt_x1f4TTtBT0n2PojzoCDudmxWhRZuksnDygiw1snVN_xRiaGWBdgRKGzmASlmWtSL9R4c6BNVAR4GkcCU4cDDxioRfgQkHV6J6nYhyGpP6wsuLAbr6f34Bk5kuOPpXpRlk48DBqVons95srs2bVgSKGlWNfRjISsnO6RpTG-PbcRCQ2Fc3R1P4IUO-dZEMVyzl7LRG2v6x_adh7YEMC0S3h-TLA-j7CO-WPNJT0iwLLRVZ_taGI-E5egXp4Ovtu5LEwsRwTLOrQ==';
let refresh_token = '';


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

  const base64 = 'Basic ' + new Buffer.from(credentials.client.id + ':' + credentials.client.secret).toString('base64')
  const fullAccessToken = 'Bearer ' + access_token

  return new Promise(function (resolve, reject) {

    request[method](someUrl, {
      // json: true,
      form: body,
      headers: {
        'Authorization': access_token ? fullAccessToken : base64
      }
    }, function (err, res) {

      if (err) return reject(err);
      const parsedBody = JSON.parse(res.body);
      resolve(parsedBody);

    })

  })

}


function generateAuthUri() {

  const authorizationUri = 'https://teamweek.com/oauth/login?response_type=code&client_id=' + credentials.client.id + '&redirect_uri=http://localhost:3000/callback'
  return authorizationUri;

}

function getToken(authCode) {
  return new Promise(function (resolve, reject) {
    req('post', 'https://teamweek.com/api/v3/authenticate/token.json', {
      grant_type: 'authorization_code',
      code: authCode,
      client_id: credentials.client.id
    }).then(function (res) {
      access_token = res.access_token
      refresh_token = res.refresh_token
      console.log(res)
      resolve(res)
    }).catch(function (e) {
      reject(e)
    })
  })
}


function getUser() {
  return new Promise(function (resolve, reject) {
    req('get', `https://teamweek.com/api/v4/me`).then(function (res) {
      const UserData = {
        name: res.name,
        workspace: res.workspaces[0].name,
        workspaceID: res.workspaces[0].id,
        userID: res.id
      }
      resolve(UserData)

    }).catch(function (err) {
      reject(err)
    })
  })
}

function getTaskList(workspaceID) {
  return new Promise(function (resolve, reject) {
    req('get', `https://teamweek.com/api/v4/${workspaceID}/tasks`).then(function (res) {
      let taskArr = [];
      res.forEach((item) => {
        const task = {
          userID: item.user_id,
          projectName: item.name,
          projectID: item.id,
          startDate: item.start_date,
          endDate: item.end_date,
          estimated: item.estimated_minutes,
          isDone: item.done
        }
        taskArr.push(task);
      })
      // console.log(taskArr);
      resolve(taskArr)

    }).catch(function (err) {
      reject(err)
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
  getToken,
  getUser,
  getTaskList
}
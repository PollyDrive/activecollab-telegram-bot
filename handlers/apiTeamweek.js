//
const credentials = {
  client: {
    id: '1765595154eefd03ffda',
    secret: '54aff154e053fea9857d2673282b7ccdb42f6b9f'
  },
  auth: {
    tokenHost: 'https://teamweek.com/',
    tokenPath: 'oauth/login',
    authorizeHost: 'https://teamweek.com/api/v4/',
    authorizePath: 'authenticate/token'
  }
};


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

// Get the access token object (the authorization code is given from the previous step).
// const tokenConfig = {
//   code: '<code>',
//   redirect_uri: 'http://localhost:3000/callback',
//   scope: '<scope>', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
// };

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
  generateAuthUri
}
var express = require('express');
var app = express();
const apiTeamweek = require('./handlers/apiTeamweek.js')



module.exports = () => {
  app.get('/auth', function (req, res) {
    const redirectURI = apiTeamweek.generateAuthUri()
    res.redirect(redirectURI);
  });
  
  app.get('/callback', function (req, res) {
    res.send(req.query.code);
    console.log('first step auth token: ' + req.query.code)
    apiTeamweek.getToken(req.query.code)
  
  });
  
  app.listen(3000, function () {
    console.log('app listening on port 3000');
  });
}


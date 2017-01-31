const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const request = require('request');


const redirect_uri = 'http://127.0.0.1:3000/auth/authorize';

// redirect to oauth provider
router.get('/login', (req, res, next) => {
  // console.log(process.env.SLACK_CLIENT_ID);
  const redirect_url = 'https://slack.com/oauth/authorize';
  const client_id = process.env.SLACK_CLIENT_ID;
  const scope = 'users.profile:read';
  const state = 'wanderers';
  const queryParams = `client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
  res.redirect(redirect_url + '?' + queryParams);
});

router.get('/authorize', (req, res, next) => {
  const code = req.query.code;
  // server exchanges code with github
  const data = {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: code,
    redirect_uri: redirect_uri,
    state: req.query.state
  }

  var options = {
        uri: 'https://slack.com/api/oauth.access?code='
            + code +
            '&client_id='+process.env.SLACK_CLIENT_ID+
            '&client_secret='+process.env.SLACK_CLIENT_SECRET+
            '&redirect_uri='+redirect_uri,
        method: 'GET'
    }

  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      // store token in session for later use
      const data = JSON.parse(body);
      console.log('body', data);
      req.session.access_token = data.access_token;
      res.redirect('/profile');
    }
  });
});



module.exports = router;

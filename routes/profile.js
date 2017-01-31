const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res, next) => {
  const access_token = req.session.access_token;
  console.log('access token profile', access_token);
  var url = `https://slack.com/api/users.profile.get?token=${access_token}&pretty=1`;
  const options = {
    method: 'GET',
    url: url
  }
  request(options, (err, response, body) => {
    const user = JSON.parse(body);
    console.log('request user', user);
    res.render('profile', {user: user.profile});
  });
});

router.get('/logout', (req, res, next) => {
  const access_token = req.session.access_token;
  const url = `https://slack.com/api/auth.revoke?token=${access_token}&pretty=1`;
  const options = {
    method: 'GET',
    url: url
  }
  request(options, (err, response, body) => {
    // const user = JSON.parse(body);
    console.log('response logout', response, 'body', body);
    res.redirect('/profile');
  });
});

module.exports = router;

const express = require("express");
const { requiresAuth } = require('express-openid-connect');
const router = express.Router();

router.get('/callback', (req, res) => {
  res.redirect("/synth");
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

router.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

module.exports = router;
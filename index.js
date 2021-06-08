const express = require("express");
const path = require("path");
const { auth, requiresAuth } = require('express-openid-connect');

var os = require('os');
const app = express();
const port = process.env.PORT || 8000;

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: (os.hostname().indexOf("local") > -1) ? 'http://localhost:8000' : "https://drive-clone-api.herokuapp.com",
    clientID: '5yUSJVHVOXqHWd2rZoaqTDYZGACxFnGP',
    issuerBaseURL: 'https://cmt-dev.eu.auth0.com'
};

app.use(auth(config));

// app.get("/", (req, res) => {
//     res.status(200).send("Found the API");
// });

app.get('/callback', (req, res) => {
    res.redirect("/");
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
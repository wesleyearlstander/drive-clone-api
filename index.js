const express = require("express");
const path = require("path");
const { auth } = require('express-openid-connect');

const app = express();
const port = process.env.PORT || "8000";

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:8000',
    clientID: '5yUSJVHVOXqHWd2rZoaqTDYZGACxFnGP',
    issuerBaseURL: 'https://cmt-dev.eu.auth0.com'
};

app.use(auth(config));

// app.get("/", (req, res) => {
//     res.status(200).send("Found the API");
// });

app.get('/callback', (req, res) => {
    res.redirect("/synth");
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/");
});

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
const express = require("express");
const path = require("path");
const { auth, requiresAuth } = require('express-openid-connect');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var os = require('os');
const app = express();
const port = process.env.PORT || 8000;
var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://cmt-dev.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://drive-clone-api.herokuapp.com/',
  issuer: 'https://cmt-dev.eu.auth0.com/',
  algorithms: ['RS256']
});

app.use(jwtCheck);

// app.get("/", (req, res) => {
//     res.status(200).send("Found the API");
// });

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send("You found our api");
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
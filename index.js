const express = require("express");
const cors = require("cors");
const { auth, requiresAuth } = require('express-openid-connect');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const os = require('os');
const request = require("request");
const dotenv = require('dotenv');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const userRouter = require("./routes/user");

dotenv.config();

const options = {
    method: 'POST',
    url: 'https://cmt-dev.eu.auth0.com/oauth/token',
    headers: {
        'content-type': 'application/json'
    },
    body: `{"client_id":"${process.env.CLIENT_ID}","client_secret":"${process.env.CLIENT_SECRET}","audience":"https://drive-clone-api.herokuapp.com/","grant_type":"client_credentials"}`
};

request(options, function (error, response, body) {
    if (error)
        throw new Error(error);
        console.log(body);
    }
);

const port = process.env.PORT || "8000";

const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Library API",
        version: "1.0.0",
        description: "A simple Express Library API",
      },
      basePath: '/',
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      servers: [
        {
            url: `http://localhost:${port}`
        },
        {
            url: "https://drive-clone-api.herokuapp.com",
        },
      ],
      security: [{
        bearerAuth: []
      }]
    },
    apis: ["./routes/*.js"],
  };

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://cmt-dev.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://drive-clone-api.herokuapp.com/',
  issuer: 'https://cmt-dev.eu.auth0.com/',
  algorithms: ['RS256'],
  credentialsRequired: false
});

const specs = swaggerJsDoc(swaggerOptions);

const app = express();

const config = {
    authRequired: true,
    auth0Logout: true,
    baseURL: 'http://localhost:8000',
    clientID: '5yUSJVHVOXqHWd2rZoaqTDYZGACxFnGP',
    issuerBaseURL: 'https://cmt-dev.eu.auth0.com',
    secret: 'xZAJUZwzL14PCuSY3L_LSvr5lmMQytAcKPw_S2AHlanobyj_rH6TEvtOqgvhw2Vz'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
  
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(jwtCheck);

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.get('/', (req, res) => {
    res.redirect("/api/docs");
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
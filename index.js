const express = require("express");
const cors = require("cors");
const { auth } = require('express-openid-connect');
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

app.use(cors());
app.use(jwtCheck);

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
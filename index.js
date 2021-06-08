const express = require("express");
const cors = require("cors");
const { auth } = require('express-openid-connect');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const authRouter = require("./routes/auth");
const os = require('os');
const request = require("request");
const dotenv = require('dotenv');

dotenv.config();

const options = {
    method: 'POST',
    url: 'https://cmt-dev.eu.auth0.com/oauth/token',
    headers: {
        'content-type': 'application/json'
    },
    body: `{"client_id":"${process.env.CLIENT_ID}","client_secret":"${process.env.CLIENT_SECRET}","audience":"https://drive-clone-api.herokuapp.com/","grant_type":"client_credentials"}`
};

request(options, function (error, response, body) { if (error) throw new Error(error); console.log(body); });

const port = process.env.port || "8000";

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:8000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: (os.hostname().indexOf("local") > -1) ? 'http://localhost:8000' : "https://drive-clone-api.herokuapp.com",
    clientID: '5yUSJVHVOXqHWd2rZoaqTDYZGACxFnGP',
    issuerBaseURL: 'https://cmt-dev.eu.auth0.com'
};

app.use(auth(config));
app.use(cors());


app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
const express = require("express");
const cors = require("cors");
const { auth } = require('express-openid-connect');
const authRouter = require("./routes/auth");
const os = require('os');

const app = express();
const port = process.env.port || "8000";

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
const dotenv = require('dotenv').config();

const auth0Config = {
  authRequired: true,
  auth0Logout: true,
  baseURL: process.env.AUTH0_BASEURL,
  clientID: process.env.AUTH0_CLIENTID,
  issuerBaseURL: process.env.AUTH0_ISSUERBASEURL,
  secret: process.env.AUTH0_SECRET
};

module.exports = auth0Config;
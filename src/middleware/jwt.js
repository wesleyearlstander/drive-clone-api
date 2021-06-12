const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

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

module.exports = jwtCheck;

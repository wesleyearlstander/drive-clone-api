const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express Library API',
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
          url: `http://localhost:${process.env.PORT || 8000}`
      },
      {
          url: 'https://drive-clone-api.herokuapp.com',
      },
    ],
      security: [
        {
          auth0: [
            'openid',
            'admin:org',
            'admin:public_key'
          ]
        }
      ],
      securityDefinitions: {
        auth0: {
          type: 'oauth2',
          scopes: {
            openid: 'Grants access to user_id',
            'admin:org': 'Fully manage organization, teams, and memberships.',
            'admin:public_key': 'Fully manage public keys.'
          },
          flow: 'accessCode',
          authorizationUrl: 'https://test.eu.auth0.com/authorize',
          tokenUrl: 'https://test.eu.auth0.com/userinfo',
          'x-token-validation-url': 'https://test.eu.auth0.com/userinfo'
        }
      },
    },
  apis: ['./src/routes/*.js'],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpecs;
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
    ]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpecs;
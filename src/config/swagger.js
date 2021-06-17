const swaggerJsDoc = require('swagger-jsdoc');

// TODO: Update info object
const swaggerOptions = {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: 'Giggle Drove Clone',
      version: '1.0.0',
      description:
        'Giggle Drove is not Google Drive, it is significantly worse.',
    },
    basePath: '/',
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
      },
      {
        url: 'https://drive-clone-api.herokuapp.com',
      },
    ],
    security: [
      {
        auth0: ['openid', 'admin:org', 'admin:public_key'],
      },
    ],
    security: [
      {
        auth0: ['openid', 'admin:org', 'admin:public_key'],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpecs;

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Router } from 'express';

const route = Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://github.com/vecolo-project/API/blob/master/LICENSE',
      },
      contact: {
        name: 'Vécolo',
        url: 'https://github.com/vecolo-project',
        email: '',
      },
    },
    servers: [
      {
        url: 'http://localhost:4562/api',
      },
    ],
  },
  apis: ['src/api/routes/*.ts'],
};

const specs = swaggerJsdoc(options);
route.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

export default route;

import { createUser, createUserBody } from './auth';

const documentationSetup = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'SIMESTA SERVER - Documentation',
    description: 'Description of my API here',
    termsOfService: 'https://mysite.com/terms',
    contact: {
      name: 'Developer name',
      email: 'dev@example.com',
      url: 'https://devwebsite.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local Server',
    },
    // {
    //   url: 'https://api.mysite.com',
    //   description: 'Production Server',
    // },
  ],
  tags: [
    {
      name: 'Courses',
    },
    {
      name: 'Users',
    },
    { name: 'Auth' },
  ],
  paths: {
    'auth/signup': {
      post: createUser,
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      createUserBody,
    },
  },
};

export { documentationSetup };

import {
  createCourseBody,
  createCourseResponse,
  createUserBody,
  createUserResponse,
  getCourseResponse,
  loginUserBody,
} from './schemas';
import { createUser, loginUser } from './auth';
import { createCourse, getCourse } from './courses';

const documentationSetup = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'SIMESTA SERVER - Documentation',
    description: 'Description of my API here',
    termsOfService: 'https://mysite.com/terms',
    contact: {
      name: 'Simesta AI',
      email: 'simesta.ai@gmail.com',
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
  tags: [{ name: 'Auth' }, { name: 'Users' }, { name: 'Courses' }],
  paths: {
    'auth/signup': {
      post: createUser,
    },
    'auth/login': {
      post: loginUser,
    },
    'users/{userId}/create-course': {
      post: createCourse,
    },
    'users/course/{courseId}': {
      get: getCourse,
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'Auth-token',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2YzViNzBiNjE5NWJjOGU5NDRjYWYwOSIsIm5hbWUiOiJLaW5nc2xleSBJaGVtZWxhbmR1IiwiZW1haWwiOiJraW5nQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJFNPbkJxZzFoSnpGZmpqT0U3UE5VNk8uSGlpZzc2cDFDaTcwM25ScDZSVUQyay91NzVHbm91IiwicHJvZmlsZVBpY3R1cmUiOiIiLCJhcHByb3ByaWF0ZUxNZXRob2QiOiIiLCJvdGhlckxNZXRob2RzIjpbXSwiY3JlYXRlZEF0IjoiMjAyNC0wOC0yMVQwOTo0NDo0My4yMThaIiwidXBkYXRlZEF0IjoiMjAyNC0wOC0yMVQwOTo0NDo0My4yMThaIiwiX192IjowfSwiaWF0IjoxNzI0MjQxMDU2LCJleHAiOjE3MjQzMjc0NTZ9.exvIiKOBE-E5ikUCr9ixjrHu_W0EolZGTYDK8iHa9v8',
      },
    },
    schemas: {
      createUserBody,
      createUserResponse,
      loginUserBody,
      createCourseBody,
      createCourseResponse,
      getCourseResponse,
    },
  },
};

export { documentationSetup };

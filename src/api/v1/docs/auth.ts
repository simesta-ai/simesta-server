export const createUser = {
  tags: ['Auth'],
  description: 'Create a new user in the system',
  operationId: 'createUser',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createUserBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'User created successfully!',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/createUserResponse',
          },
        },
      },
    },
    '500': {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
};

export const loginUser = {
  tags: ['Auth'],
  description: 'Login a user in the system',
  operationId: 'loginUser',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/loginUserBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'User logged in successfully!',
      headers: {
        'Set-Cookie': {
          schema: {
            type: 'string',
            example:
              'Auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2YzViNzBiNjE5NWJjOGU5NDRjYWYwOSIsIm5hbWUiOiJLaW5nc2xleSBJaGVtZWxhbmR1IiwiZW1haWwiOiJraW5nQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJFNPbkJxZzFoSnpGZmpqT0U3UE5VNk8uSGlpZzc2cDFDaTcwM25ScDZSVUQyay91NzVHbm91IiwicHJvZmlsZVBpY3R1cmUiOiIiLCJhcHByb3ByaWF0ZUxNZXRob2QiOiIiLCJvdGhlckxNZXRob2RzIjpbXSwiY3JlYXRlZEF0IjoiMjAyNC0wOC0yMVQwOTo0NDo0My4yMThaIiwidXBkYXRlZEF0IjoiMjAyNC0wOC0yMVQwOTo0NDo0My4yMThaIiwiX192IjowfSwiaWF0IjoxNzI0MjQxMDU2LCJleHAiOjE3MjQzMjc0NTZ9.exvIiKOBE-E5ikUCr9ixjrHu_W0EolZGTYDK8iHa9v8',
          },
        },
      },
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/createUserResponse',
          },
        },
      },
    },
    '500': {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
};

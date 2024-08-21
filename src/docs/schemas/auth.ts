export const createUserBody = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'John Snow',
    },
    email: {
      type: 'string',
      example: 'john.snow@email.com',
    },
    password: {
      type: 'string',
      description: "unencrypted user's password",
      example: '!1234aWe1Ro3$#',
    },
  },
};

export const createUserResponse = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: '60564fcb544047cdc3844818',
    },
    name: {
      type: 'string',
      example: 'John Snow',
    },
  },
};

export const loginUserBody = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      example: 'john.snow@email.com',
    },
    password: {
      type: 'string',
      description: "unencrypted user's password",
      example: '!1234aWe1Ro3$#',
    },
  },
};

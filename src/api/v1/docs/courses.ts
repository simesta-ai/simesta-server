export const createCourse = {
  tags: ['Courses', 'Users'],
  description: 'Create a course',

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
          $ref: '#/components/schemas/createCourseBody',
        },
      },
    },
    required: true,
  },
  parameters: [
    {
      in: 'path',
      name: 'userId',
      required: true,
      schema: {
        type: 'string',
        example: '398rh9ch94793t597cg98',
        description: 'The user Id',
      },
    },
  ],
  responses: {
    '201': {
      description: 'Course created successfully!',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/createCourseResponse',
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

export const getCourse = {
  tags: ['Courses'],
  description: 'Get a course',
  operationId: 'getCourse',
  security: [
    // {
    //   cookieAuth: [],
    // },
  ],
  responses: {
    '200': {
      description: 'Course fetched successfully!',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/getCourseResponse',
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

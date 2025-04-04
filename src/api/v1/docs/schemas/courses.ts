export const createCourseBody = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      example: 'How to be rich',
      required: true,
    },
    subtopics: {
      type: 'array',
      example: [],
      required: false,
    },
  },
};

export const createCourseResponse = {
  type: 'object',
  properties: {
    courseId: {
      type: 'string',
      example: '60564fcb544047cdc3844818',
    },
  },
};

export const getCourseResponse = {
  type: 'object',
  properties: {
    course: {
      type: 'object',
      examples: {},
    },
    topics: {
      type: 'array',
      example: [],
    },
  },
};

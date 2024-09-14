import TopicController from './controllers'
import express from 'express'
const router = express.Router()
const topicController = new TopicController()

router
  .route('/topic/:topicId')
  .post(topicController.createTopicLectures)
  .get(topicController.getTopicLectures)

  // router
//   .route('/course/topic/:topicId')
//   .get(userController.getTopic) => get topicLectures
//   .post(userController.createTopic) => create topicLectures

export default router
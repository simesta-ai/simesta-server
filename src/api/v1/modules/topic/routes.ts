import TopicController from './controllers'
import express from 'express'
const router = express.Router()
const topicController = new TopicController()

router
  .route('/topic/:topicId')
  .post(topicController.createTopicLectures)
  .get(topicController.getTopicLectures)

export default router
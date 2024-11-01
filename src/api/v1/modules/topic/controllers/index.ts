import TopicService from '../services'
import { NextFunction, Request, Response } from 'express'


const topicService = new TopicService()

class TopicController {

  async createTopicLectures(req: Request, res: Response, next: NextFunction) {
    try {
      const { topicId } = req.params
      const { topic, lectures, error } = await topicService.createTopicLectures(topicId)
      if (error) {
        throw error
      } else {
        res.status(200).json({ topic, lectures })
      }
    } catch (error) {
      next(error)
    }
  }

  async getTopicLectures(req: Request, res: Response, next: NextFunction) {
    try {
      const topicId = req.params.topicId
      const { topic, lectures, error } =
        await topicService.getTopicWithLectures(topicId)
      if (error) {
        throw error
      } else {
        res.status(200).json({ topic, lectures })
      }
    } catch (error) {
      next(error)
    }
  }
}

export default TopicController
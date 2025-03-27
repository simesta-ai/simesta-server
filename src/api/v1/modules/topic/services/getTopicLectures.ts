import {
  CustomError,
  ServerError,
} from '../../../../../libs/utils/handlers/error'
import { ITopicLecture } from '../../../../../types'
import LectureRepository from '../../lecture/repository'

import TopicRepository from '../repository'

import logger from '../../../../../libs/utils/logger'
const lectureRepository = new LectureRepository()
const topicRepository = new TopicRepository()

const getTopicWithLectures = async (topicId: string) => {
  let error: CustomError | null = null
  let topicTitle: string = ''
  let topicLectures: ITopicLecture[] = []
  try {
    const originalTopic = await topicRepository.findById(topicId)
    if (originalTopic) {
      topicTitle = originalTopic.title
      const existingLectures = await lectureRepository.findByTopicId(topicId)
      // If the topic has lectures already return them
      if (existingLectures.length > 0) {
        for (const lecture of existingLectures) {
          console.log(lecture)
          topicLectures.push({
            id: lecture.id,
            title: lecture.title,
            position: lecture.position,
          })
        }

        // if the topic does not have existing lectures, create new ones
      } else {
        error = new ServerError(
          'Unable to fetch topic content, no lectures exist'
        )
      }
    } else {
      error = new ServerError('This topic does not exist')
    }
  } catch (error) {
    logger.error(error)
  }
  return {
    topic: { id: topicId, title: topicTitle },
    lectures: topicLectures,
    error: error,
  }
}

export default getTopicWithLectures

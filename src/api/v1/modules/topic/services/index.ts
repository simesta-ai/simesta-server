import createTopics from './createTopics'
import createTopicLectures from './HandleTopicLecture'
import { CustomError } from '../../../../../libs/utils/handlers/error'
import { ITopicLecture } from '../../../../../types'
import getTopicWithLectures from './getTopicLectures'

class TopicService {
  constructor() {
    this.createTopicLectures = this.createTopicLectures.bind(this)
    this.getTopicWithLectures = this.getTopicWithLectures.bind(this)
  }

  createTopics: (
    courseId: string,
    courseTitle: string,
    courseFiles?: any,
    subtopics?: string
  ) => Promise<void> = createTopics

  //New methods
  createTopicLectures: (topicId: string) => Promise<{
    topic: { id: string; title: string }
    lectures: ITopicLecture[]
    error: CustomError | null
  }> = createTopicLectures

  getTopicWithLectures: (topicId: string) => Promise<{
    topic: { id: string; title: string }
    lectures: ITopicLecture[]
    error: CustomError | null
  }> = getTopicWithLectures
}

export default TopicService

import createTopics from './createTopics'

class TopicService {
  createTopics: (
    courseId: string,
    courseTitle: string,
    courseFiles?: any,
    subtopics?: string
  ) => Promise<void> = createTopics
}
export default TopicService

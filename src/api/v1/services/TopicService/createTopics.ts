import TopicModel from '../../../../config/database/schemas/topic.model'
import AIGenerator from '../../../../libs/utils/services/aigenerator'

const aigenerator = new AIGenerator()

const createTopics = async (
  courseId: string,
  courseTitle: string,
  files?: any,
  subtopics?: string
) => {
  if (files && subtopics) {
  } else if (files && !subtopics) {
    const newTopics = await aigenerator.generateTopicsWithFile(
      courseTitle,
      files
    )
    for (const topic of newTopics) {
      const topicPosition = newTopics.indexOf(topic) + 1
      await new TopicModel({
        title: topic,
        position: topicPosition,
        course: courseId,
        inProgress: topicPosition === 1 ? true : false,
      }).save()
    }
  } else if (!files && subtopics) {
  } else {
    const newTopics = await aigenerator.generateTopics(courseTitle)
    for (const topic of newTopics) {
      const topicPosition = newTopics.indexOf(topic) + 1
      await new TopicModel({
        title: topic,
        position: topicPosition,
        course: courseId,
        inProgress: topicPosition === 1 ? true : false,
      }).save()
    }
  }
}

export default createTopics

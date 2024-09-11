import TopicRepository from '../repository/index'
import AIGenerator from '../../../../../libs/utils/services/aigenerator'

const AIGen = new AIGenerator()
const topicRepository = new TopicRepository()

const createTopics = async (
  courseId: string,
  courseTitle: string,
  courseFiles?: any,
  subtopics?: string
) => {
    const newTopics = await AIGen.generateTopics(courseTitle, courseFiles, subtopics)

  newTopics.forEach(async (topic, index) => {
    const topicPosition = index + 1
    await topicRepository.createOne({
      title: topic,
      position: topicPosition,
      courseId: courseId,
      inProgress: topicPosition === 1 ? true : false
    })
  })
}


export default createTopics

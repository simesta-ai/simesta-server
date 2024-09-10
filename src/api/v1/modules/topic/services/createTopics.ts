import TopicRepository from '../repository'
import AIGenerator from '../../../../../libs/utils/services/aigenerator'

const AIGen = new AIGenerator()
const topicRepository = new TopicRepository()

const createTopics = async (
  courseId: string,
  courseTitle: string,
  files?: any,
  subtopics?: string
) => {
  const courseFiles = files.join(' ')

  const newTopics = await AIGen.generateTopics(courseTitle, courseFiles, subtopics)

  newTopics.forEach(async (topic, index) => {
    const topicPosition = index + 1
    await topicRepository.createOne({
      title: topic,
      position: topicPosition,
      course: courseId,
      inProgress: topicPosition === 1 ? true : false
    })
  })
}

export default createTopics

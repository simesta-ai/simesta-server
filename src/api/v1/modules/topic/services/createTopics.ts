import TopicRepository from '../repository/index'
import AIGenerator from '../../../../../libs/utils/services/aigenerator'
import { ITopic } from '../../../../../types'


const AIGen = new AIGenerator()
const topicRepository = new TopicRepository()

const createTopics = async (
  courseId: string,
  courseTitle: string,
  userId: string,
  courseFiles?: any,
  subtopics?: string
) => {
  try {
    const newTopics = await AIGen.generateTopics(
      courseTitle,
      courseFiles,
      subtopics
    )

    const createdTopics: ITopic[] = await new Promise((resolve, reject) => {
      try {
        const topics: ITopic[] = []
        newTopics.forEach(async (topic, index) => {
          const topicPosition = index + 1
          const topicData = await topicRepository.createOne({
            title: topic,
            position: topicPosition,
            courseId: courseId,
            inProgress: topicPosition === 1 ? true : false,
          })
          topics.push(topicData)
        })
        resolve(topics)
      } catch (error) {
        reject(error)
      }
    })

    return createdTopics
  } catch (error) {
    throw error
  }
}

export default createTopics

import { algoliasearch } from 'algoliasearch'
import { ICourse, ITopic, ILectureContent } from '../../../types'

//done
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_WRITE_API_KEY as string
)

export const createAndPopulateCourseIndex = async (
  course: ICourse,
  userId: string
) => {
  try {
    const response = await client.addOrUpdateObject({
      indexName: 'courseIndex',
      objectID: course.id,
      body: {
        courseId: course.id,
        userId: userId,
        title: course.title,
        description: course.description,
        category: course.category,
        difficultyLevel: course.difficultyLevel,
        createdAt: course.createdAt,
      },
    })
    console.log('Algolia response:', response)
  } catch (error) {
    console.error('Error adding course to Algolia:', error)
  }
}

export const createAndPopulateTopicIndex = async (
  topic: ITopic,
  userId: string
) => {
  try {
    const response = await client.addOrUpdateObject({
      indexName: 'topicIndex',
      objectID: topic.id,
      body: {
        topicId: topic.id,
        userId: userId,
        courseId: topic.courseId,
        title: topic.title,
        position: topic.position,
        completed: topic.completed,
        inProgress: topic.inProgress,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,
      },
    })
    console.log('Algolia response:', response)
  } catch (error) {
    console.error('Error adding topic to Algolia:', error)
  }
}

export const createAndPopulateLectureIndex = async (
  lectureId: string,
  lectureContent: ILectureContent,
  userId: string
) => {
  try {
    const response = await client.addOrUpdateObject({
      indexName: 'lectureIndex',
      objectID: lectureId,
      body: {
        lectureId: lectureId,
        userId: userId,
        videos: lectureContent.videos,
        ideas: lectureContent.ideaContent,
      },
    })
    console.log('Algolia response:', response)
  } catch (error) {
    console.error('Error adding lecture to Algolia:', error)
  }
}

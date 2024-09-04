/**
 * authors: [{Kingsley X<@kijuchihe>}]
 */
import logger from '../../../../../libs/utils/logger'
import {
  AuthError,
  CustomError,
  ServerError,
} from '../../../../../libs/utils/handlers/error'

// Repositories

import UserRepository from '../../user/repository'
import CourseRepository from '../repository'

const userRepository = new UserRepository()
const courseRepository = new CourseRepository()

export interface ICourseResponse {
  id: string
  title: string
  img: string
  progress: number
  topicsCompleted: string
}

const getUserCourses = async (
  userId: string
): Promise<{
  coursesList: Array<ICourseResponse>
  error: CustomError | null
}> => {
  let error: CustomError | null = null
  const coursesList: Array<ICourseResponse> = []
  try {
    const user = await userRepository.findById(userId)
    if (user) {
      const courses = await courseRepository.find({ user: userId })
      if (courses.length < 1)
        return {
          coursesList,
          error: new ServerError('User does not have any course created yet'),
        }
      for (const course of courses) {
        // const topics: any = await TopicModel.find({ course: course.id })
        const topics: any[] = []
        const numberOfTopics = topics.length
        let i = 0
        for (const topic of topics) {
          if (topic.completed) {
            i++
          }
        }
        coursesList.push({
          id: course.id,
          title: course.title,
          img: course.img ? course.img : 'null',
          progress: (i / numberOfTopics) * 100,
          topicsCompleted: `${i} / ${numberOfTopics}`,
        })
      }
      if (coursesList.length < 1 && courses.length > 0) {
        error = new ServerError('Error retrieving courses, please retry')
      }
    } else {
      error = new AuthError("Couldn't fetch courses, user is invalid")
    }
  } catch (error) {
    logger.error(error)
  }
  return { coursesList, error }
}

export default getUserCourses

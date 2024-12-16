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

import { redisService } from '../../../../../libs/utils/services/redis'

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
    // Check if users courses are in cache
    const getCachedUserCourses = async (userId: string) => {
      try {
        const pattern = `user:${userId}:course:*`
        const courseKeys = await redisService.keys(pattern)

        if (courseKeys.length === 0) {
          logger.info(`No courses found in cache for user ${userId}`)
          return []
        }

        const courses: ICourseResponse[] = []
        for (const key of courseKeys) {
          const courseData = await redisService.hgetall(key)
          if (courseData) {
            // get course topics
            const topicPattern = `course:${courseData.id}:topic:*`
            const topicKeys = await redisService.keys(topicPattern)
            const topics = []
            for (const topicKey of topicKeys) {
              const topicData = await redisService.hgetall(topicKey)
              if (topicData) {
                topics.push({
                  id: topicData.id,
                  title: topicData.title,
                  position: topicData.position,
                  completed: topicData.completed,
                  inProgress: topicData.inProgress,
                  courseId: topicData.courseId,
                })
              }
            }
            if (topics.length > 0) {
              const numberOfTopics = topics.length
              let i = 0
              for (const topic of topics) {
                if (topic.completed) {
                  i++
                }
              }
              courses.push({
                id: courseData.id,
                title: courseData.title,
                img: courseData.img ? courseData.img : 'null',
                progress: (i / numberOfTopics) * 100,
                topicsCompleted: `${i} / ${numberOfTopics}`,
              })
            }
          }
        }
        if(courses.length > 0) {
          return courses
        } else {
          return []
        }
      } catch (error) {
        logger.error(`Failed to fetch courses for user ${userId}:`, error)
        return []
      }
    }
    const cachedCourses = await getCachedUserCourses(userId)
    if (cachedCourses.length > 0) {
      return {
        coursesList: cachedCourses,
        error: null,
      }
    }

    // If not in cache, fetch from database
    const user = await userRepository.findById(userId)
    if (user) {
      const courses = await courseRepository.find({ userId: userId })
      if (courses.length < 1)
        return {
          coursesList,
          error: new ServerError('User does not have any course created yet'),
        }
      for (const course of courses) {
        // const topics: any = await TopicModel.find({ course: course.id })
        const topics: any[] = course.topics
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
          img: course.image ? course.image : 'null',
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

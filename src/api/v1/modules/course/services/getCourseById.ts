import CourseRepository from '../repository'
import logger from '../../../../../libs/utils/logger'

import { redisService } from '../../../../../libs/utils/services/redis'

const courseRepository = new CourseRepository()
const getCourseById = async (id: string, userId: string) => {
  try {
    // Check if users courses are in cache
    const getCachedCourse = async (courseId: string, userId: string) => {
      try {
        const coursePattern = `user:${userId}:course:${courseId}`
        const topicPattern = `course:${courseId}:topic:*`

        const courseData = await redisService.hgetall(coursePattern)
        const topicKeys = await redisService.keys(topicPattern)
        const topics = []
        if (courseData) {
          for (const key of topicKeys) {
            const topicData = await redisService.hgetall(key)
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
          const numberOfTopics = topics.length
          let i = 0
          for (const topic of topics) {
            if (topic.completed) {
              i++
            }
          }
          return {
            course: {
              id: courseData.id,
              title: courseData.title,
              description: courseData.description,
              img: courseData.img,
              category: courseData.category,
              userId: courseData.userId,
              progress: (i / numberOfTopics) * 100,
              topicsCompleted: `${i} / ${numberOfTopics}`,
              completed: courseData.completed,
              inProgress: courseData.inProgress,
              courseType: courseData.courseType,
              difficultyLevel: courseData.difficultyLevel,
              notes: courseData.notes,
              createdAt: courseData.createdAt,
              updatedAt: courseData.updatedAt,
            },
            topics: topics,
          }
        } else {
          logger.info(`Course not found in cache for user ${userId}`)
          return null
        }
      } catch (error) {
        logger.error(`Failed to fetch courses for user ${userId}:`, error)
        return null
      }
    }
    // const cachedCourse = await getCachedCourse(id, userId)
    // console.log(cachedCourse)
    // if (cachedCourse) {
    //   return cachedCourse
    // }

    // If not in cache, fetch from database
    const course = await courseRepository.findCourseWithTopics(id)
    if (!course) {
      throw new Error('Course not found')
    }
    const topics = course.topics
    const numberOfTopics = topics.length
    let i = 0
    for (const topic of topics) {
      if (topic.completed) {
        i++
      }
    }
    setImmediate(async () => {
      try {
        await redisService.hset(`user:${userId}:course:${course.id}`, {
          id: course.id,
          title: course.title,
          description: course.description,
          img: course.image,
          category: course.category,
          userId: course.userId,
          completed: course.completed,
          inProgress: course.inProgress,
          courseType: course.courseType,
          difficultyLevel: course.difficultyLevel,
          notes: course.notes,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
        })
        for (const topic of topics) {
          await redisService.hset(
            `course:${course.id}:topic:${topic.id}`,
            topic
          )
        }
      } catch (error) {
        logger.error(`Failed to cache course ${course.id} for user ${userId}`)
      }
    })
    return {
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        img: course.image,
        category: course.category,
        userId: course.userId,
        progress: (i / numberOfTopics) * 100,
        topicsCompleted: `${i} / ${numberOfTopics}`,
        completed: course.completed,
        inProgress: course.inProgress,
        courseType: course.courseType,
        difficultyLevel: course.difficultyLevel,
        notes: course.notes,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      },
      topics: topics,
    }
  } catch (error) {
    throw error
  }
}

export default getCourseById

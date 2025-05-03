import fs from 'fs'

import {
  AuthError,
  CustomError,
  ServerError,
} from '../../../../../libs/utils/handlers/error'
import AIGenerator from '../../../../../libs/utils/services/aigenerator'
import { FileService } from '../../../../../libs/utils/services/parseFile'
import { ICreateCourse } from '../../../../../types'
import TopicService from '../../topic/services'
import BucketManager from '../../../../../libs/utils/services/BucketManager'
import { redisService } from '../../../../../libs/utils/services/redis'
import NotificationService from '../../notifications/services/notifications'
import {
  createAndPopulateCourseIndex,
  createAndPopulateTopicIndex,
} from '../../../../../libs/utils/search/algolia'

// Repositories
import CourseRepository from '../repository'
import UserRepository from '../../user/repository'
import logger from '../../../../../libs/utils/logger'
import randomReminder from '../../notifications/services/randomCourseReminder'

const AIGen = new AIGenerator()
const fileService = new FileService()
const topicService = new TopicService()

const userRepository = new UserRepository()
const courseRepository = new CourseRepository()
const bucketManager = new BucketManager()
const notificationService = new NotificationService()

const createCourse = async ({
  userId,
  title,
  files,
  subtopics,
}: ICreateCourse): Promise<{
  courseId: string | null
  error: CustomError | null
}> => {
  let error: CustomError | null = null
  try {
    const user = await userRepository.findById(userId)
    if (!user) {
      return {
        courseId: null,
        error: new AuthError('User does not exist, cannot create course'),
      }
    }
    const validCourseTitle = await AIGen.confirmCourseTitle(title)
    if (!validCourseTitle)
      return {
        courseId: null,
        error: new AuthError('Invalid course title'),
      }
    const courseDescription = await AIGen.generateCourseDescription(title)
    const courseCategory = await AIGen.generateCoursecategory(title)
    const courseImage = await AIGen.generateCourseImage(title)

    let fileUrls: string[] = []
    let fileContent: string[] = []

    if (files) {
      // Add files to course and generate course topics
      const filePaths = Array.isArray(files) ? files.map((file) => file.path) : []

      const fileData: {
        filePath: string
        success: boolean
        data: string | null
        fileUrl: string | null
        error: CustomError | null
      }[] = await Promise.all(
        filePaths.map(async (filePath: string) => {
          try {
            const { fileUrl, UploadError } = await bucketManager.uploadFiles(
              filePath
            )
            if (UploadError) {
              throw new ServerError(
                `Upload failed for ${filePath}: ${UploadError.message}`
              )
            }

            const { data, fileError } = await fileService.parseFile(filePath)
            if (fileError) {
              throw new ServerError(
                `Parsing failed for ${filePath}: ${fileError.message}`
              )
            }

            if (fileUrl && data) {
              await redisService.set(fileUrl, JSON.stringify(data))
            }
            return {
              filePath,
              success: true,
              data,
              fileUrl,
              error: null,
            }
          } catch (error: any) {
            logger.error(`Error processing ${filePath}:`, error)
            return {
              filePath,
              success: false,
              data: null,
              fileUrl: null,
              error: new ServerError(
                `Failed to process ${filePath}: ${error.message}`
              ),
            }
          }
        })
      )

      const failedFiles = fileData.filter((file) => !file.success)
      if (failedFiles.length == filePaths.length) {
        error = new ServerError(
          `Failed to process files: ${failedFiles
            .map((file: any) => file.filePath)
            .join(', ')}`
        )
        return { courseId: null, error }
      }

      filePaths.forEach((filePath: string) => {
        fs.unlinkSync(filePath)
      })

      const validFileData = fileData.filter((file) => file.success && file.fileUrl && file.data)

      fileUrls = validFileData.map((file) => file.fileUrl as string)

      fileContent = validFileData.map((file) => file.data as string)
    }

    // Add files to course
    const newCourse = await courseRepository.createOne({
      title,
      description: courseDescription as string,
      category: courseCategory,
      image: courseImage,
      userId,
      courseFiles: fileUrls,
    })
    if (newCourse && newCourse.id) {
      console.log('creating topics')
      const topics = await topicService.createTopics(
        newCourse!.id,
        newCourse!.title,
        fileContent.join(' '),
        subtopics,
        userId
      )

      setImmediate(async () => {
        if (newCourse) {
          try {
            await redisService.hset(
              `user:${userId}:course:${newCourse.id}`,
              newCourse
            )
          } catch (err) {
            logger.error(
              `Failed to cache course ${newCourse.id} for user ${userId}`
            )
          }
        }
        if (topics) {
          topics.forEach(async (topic) => {
            try {
              await redisService.hset(
                `course:${newCourse.id}:topic:${topic.id}`,
                topic
              )
            } catch (err) {
              logger.error(
                `Failed to cache course ${newCourse.id} for user ${userId}`
              )
            }
          })
        }
        if (newCourse && newCourse.id) {
          //Add courses to algolia
          try {
            console.log(newCourse)
            await createAndPopulateCourseIndex(newCourse, userId)
          } catch (err) {
            logger.error(
              `Failed to add course ${newCourse.id} to course index for user ${userId}`
            )
          }

          // Add topics to algolia
          if (topics) {
            try {
              await Promise.all(
                topics.map(async (topic) => {
                  await createAndPopulateTopicIndex(topic, userId)
                })
              )
            } catch (err) {
              logger.error(
                `Failed to add topics to topic index for course ${newCourse.id} for user ${userId}`
              )
            }
          }

          // Add reminder notification for course
          try {
            const notification = randomReminder(newCourse.title)
            await notificationService.addNotificationJob(
              userId,
              newCourse.id,
              'reminder',
              notification.title,
              notification.subtitle,
              notification.body,
              24 * 60 * 1000 // 24 hours
            )
          } catch (err) {
            logger.error(
              `Failed to cache course ${newCourse.id} for user ${userId}`
            )
          }
        }
      })

      return { courseId: newCourse.id, error }
    }
    return { courseId: null, error }
  } catch (err) {
    return { courseId: null, error }
  }
}

export default createCourse

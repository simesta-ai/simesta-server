import fs from 'fs'

import {
  AuthError,
  CustomError,
} from '../../../../../libs/utils/handlers/error'
import AIGenerator from '../../../../../libs/utils/services/aigenerator'
import { FileService } from '../../../../../libs/utils/services/parseFile'
import { ICreateCourse } from '../../../../../types'
import TopicService from '../../topic/services'
import UploadFilesToBucket from '../../../../../libs/utils/services/uploadFIlesToBucket'
import { redisService } from '../../../../../libs/utils/services/redis'

// Repositories
import CourseRepository from '../repository'
import UserRepository from '../../user/repository'

const AIGen = new AIGenerator()
const fileService = new FileService()
const topicService = new TopicService()

const userRepository = new UserRepository()
const courseRepository = new CourseRepository()
const uploadFilesToBucket = new UploadFilesToBucket()

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
  let newCourse = null
  const user = await userRepository.findById(userId)
  if (!user) {
    return {
      courseId: newCourse,
      error: new AuthError('User does not exist, cannot create course'),
    }
  }
  const validCourseTitle = await AIGen.confirmCourseTitle(title)
  if (!validCourseTitle)
    return {
      courseId: newCourse,
      error: new AuthError('User does not exist, cannot create course'),
    }
  const courseDescription = await AIGen.generateCourseDescription(title)
  const courseCategory = await AIGen.generateCoursecategory(title)
  const courseImage = await AIGen.generateCourseImage(title)

  console.log('Done with the course resource generation')

  let fileUrls: string[] = []
  let fileContent: string[] = []

  if (files) {
    console.log('Starting work on files')
    // Add files to course and generate course topics
    const filePaths = files.map((file: any) => file.path)
    const fileData = await Promise.all(
      filePaths.map(async (filePath: string) => {
        const { fileUrl, UploadError } = await uploadFilesToBucket.uploadFiles(
          filePath
        )
        if (UploadError) {
          error = UploadError
        }
        const { data, fileError } = await fileService.parseFile(filePath)
        if (fileError) {
          error = fileError
        }
        if (fileUrl && data) {
          await redisService.client.set(fileUrl, JSON.stringify(data))

        }

        return { data, fileUrl }
      })
    )

    filePaths.forEach((filePath: string) => {
      fs.unlinkSync(filePath)
    })

    fileUrls = fileData.map((file: any) => file.fileUrl)
    fileContent = fileData.map((file: any) => file.data)
  }

  // Add files to course
  newCourse = await courseRepository.createOne({
    title,
    description: courseDescription as string,
    category: courseCategory,
    image: courseImage,
    userId,
    courseFiles: fileUrls,
  })

  const createdTopics = await topicService.createTopics(
    newCourse!.id,
    newCourse!.title,
    fileContent.join(' '),
    subtopics
  )
  console.log(createdTopics)

  return { courseId: newCourse?.id, error }
}

export default createCourse

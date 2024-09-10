import fs from 'fs'

import {
  AuthError,
  CustomError,
} from '../../../../../libs/utils/handlers/error'
import AIGenerator from '../../../../../libs/utils/services/aigenerator'
import { FileService } from '../../../../../libs/utils/services/parseFile'
import { ICreateCourse } from '../../../../../types'
import TopicService from '../../topic/services'

// Repositories
import CourseRepository from '../repository'
import UserRepository from '../../user/repository'
import TopicRepository from '../../topic/repository'

const AIGen = new AIGenerator()
const fileService = new FileService()
const topicService = new TopicService()

const userRepository = new UserRepository()
const courseRepository = new CourseRepository()
const topicRepository = new TopicRepository()

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
  let courseFiles = null
  const user = await userRepository.findById(userId)
  if (!user) {
    return {
      courseId: newCourse,
      error: new AuthError('User does not exist, cannot create course'),
    }
  }
  const validCourseTitle = await AIGen.confirmCourseTitle(title)
  if (!validCourseTitle) {
    return {
      courseId: newCourse,
      error: new AuthError('User does not exist, cannot create course'),
    }
  }
  // Course creation logic goes here
  const courseDescription = await AIGen.generateCourseDescription(title)
  const courseCategory = await AIGen.generateCoursecategory(title)
  const courseImage = await AIGen.generateCourseImage(title)
  if (files) {
    const filePaths = files.map((file: any) => file.path)
    const fileData = await Promise.all(
      filePaths.map(async (filePath: string) => {
        const { data, fileError } = await fileService.parseFile(filePath)
        if (fileError) {
          error = fileError
        }
        return data
      })
    )
    filePaths.forEach((filePath: string) => {
      fs.unlinkSync(filePath)
    })
    courseFiles = fileData
  }

  newCourse = await courseRepository.createOne({
    title,
    description: courseDescription,
    category: courseCategory,
    image: courseImage,
    userId,
    courseFiles: courseFiles
  })

  if (!newCourse) return { courseId: null, error }

  topicService.createTopics(
    newCourse!.id,
    newCourse!.title,
    newCourse.courseFiles,
    subtopics
  )

  return { courseId: newCourse?.id, error }
}

export default createCourse

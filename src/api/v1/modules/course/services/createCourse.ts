import fs from 'fs'

import {
  AuthError,
  CustomError,
} from '../../../../../libs/utils/handlers/error'
import AIGenerator from '../../../../../libs/utils/services/aigenerator'
import { FileService } from '../../../../../libs/utils/services/parseFile'
import { ICreateCourse } from '../../../../../types'

// Repositories
import CourseRepository from '../repository'
import UserRepository from '../../user/repository'
import TopicRepository from '../../topic/repository'

class TopicService {
  createTopics(data1: any, data2: any, data3?: any) {}
}
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
  const description = await AIGen.generateCourseDescription(title)
  const courseCategory = await AIGen.generateCoursecategory(title)
  const courseImage = await AIGen.generateCourseImage(title)

  if (files && !subtopics) {
    // Add files to course and generate course topics
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

    // Add files to course
    newCourse = await courseRepository.createOne({
      title,
      description: description as string,
      category: courseCategory,
      image: courseImage,
      userId,
      courseFiles: fileData,
    })

    await topicService.createTopics(
      newCourse!.id,
      newCourse!.title,
      newCourse!.courseFiles.join(' ')
    )
    return { courseId: newCourse?.id, error }
  } else if (files && subtopics) {
    // Add files to course and include the subtpics in implementation
  } else if (!files && subtopics) {
    // Implement topics creation from just subtopics provided
  }
  newCourse = await courseRepository.createOne({
    title,
    description: description,
    category: courseCategory,
    image: courseImage,
    userId,
  })

  await topicService.createTopics(newCourse!.id, newCourse!.title)

  if (!newCourse) return { courseId: null, error }

  return { courseId: newCourse?.id, error }
}

export default createCourse

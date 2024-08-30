import {
  AuthError,
  ClientError,
  CustomError,
} from '../../../../libs/utils/handlers/error'
import AIGenerator from '../../../../libs/utils/services/aigenerator'
import { FileService } from '../../../../libs/utils/services/parseFile'
import fs from 'fs'
import TopicService from '../TopicService'

import { ICreateCourse } from '../../../../types'

import CourseRepository from '../../../../config/database/repositories/CourseRepository'
import UserRepository from '../../../../config/database/repositories/UserRepository'

const AIGen = new AIGenerator()
const fileService = new FileService()
const topicService = new TopicService()

const userRepository = new UserRepository()
const courseRepository = new CourseRepository()

const createCourse = async ({
  userId,
  title,
  files,
  subtopics,
}: ICreateCourse) => {
  let error: CustomError | null = null
  let newCourse = null
  const user = await userRepository.findById(userId)
  if (!user) {
    throw new AuthError('User does not exist, cannot create course')
  }
  const validCourseTitle = await AIGen.confirmCourseTitle(title)
  if (!validCourseTitle) return
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
    newCourse = await courseRepository.createCourse({
      title,
      description: description as string,
      category: courseCategory,
      image: courseImage,
      user: userId,
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
  newCourse = await courseRepository.createCourse({
    title,
    description: description,
    category: courseCategory,
    image: courseImage,
    user: userId,
  })

  await topicService.createTopics(newCourse!.id, newCourse!.title)

  if (!newCourse) return

  return { courseId: newCourse?.id, error }
}

export default createCourse

import { NextFunction, Request } from 'express'
import createCourse from './createCourse'
import getAllCourses from './getAllCourses'
import { ICourse, ICreateCourse } from '../../../../types'
import {
  AuthError,
  ClientError,
  CustomError,
} from '../../../../libs/utils/handlers/error'
import getCourse from './getCourse'
import UserRepository from '../../../../config/database/repositories/UserRepository'
import AIGenerator from '../../../../libs/utils/services/aigenerator'
import { FileService } from '../../../../libs/utils/services/parseFile'
import TopicService from '../TopicService'
import CourseRepository from '../../../../config/database/repositories/CourseRepository'

const userRepository = new UserRepository()
const courseRepository = new CourseRepository()
const AIGen = new AIGenerator()
const fileService = new FileService()
const topicService = new TopicService()

class CourseService {
  private createCourseStructure = async (
    courseTitle: string,
    userId: string
  ) => {
    let courseError: CustomError | null = null
    let newCourse = null
    const user = await userRepository.findById(userId)
    if (!user) {
      courseError = new AuthError('User does not exist, cannot create course')
    } else {
      const courseDescription = await AIGen.generateCourseDescription(
        courseTitle
      )
      const courseCategory = await AIGen.generateCoursecategory(courseTitle)
      const courseImage = await AIGen.generateCourseImage(courseTitle)
      newCourse = await courseRepository.createCourse({
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        image: courseImage,
        user: userId,
      })
    }
    return { newCourse, courseError }
  }
  createCourse = async ({
    userId,
    title,
    files,
    subtopics,
  }: ICreateCourse): Promise<{ courseId: string | null; error: any }> => {
    let error: CustomError | null = null
    let courseId: string = ''

    try {
    } catch (error) {}

    const isValidCourseTitle = await AIGen.confirmCourseTitle(title)
    if (!isValidCourseTitle)
      return {
        courseId: null,
        error: new ClientError(
          'Invalid course title, please enter a valid title.'
        ),
      }

    const { newCourse, courseError } = await this.createCourseStructure(
      title,
      userId
    )
    if (courseError) return { courseId: null, error: courseError }
    courseId = newCourse!.id
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
      await CourseModel.updateOne(
        { id: newCourse!.id },
        { $set: { courseFiles: fileData } }
      )
      await newCourse!.save()
      await topicService.createTopics(
        newCourse!.id,
        newCourse!.title,
        newCourse!.courseFiles.join(' ')
      )
    } else if (files && subtopics) {
      // Add files to course and include the subtpics in implementation
    } else if (!files && subtopics) {
      // Implement topics creation from just subtopics provided
    } else {
      // Auto-generate topics
      await topicService.createTopics(newCourse!._id, newCourse!.title)
    }

    return { courseId, error }
  }

  getAllCourses: (userId: string) => Promise<{
    coursesList: Array<ICourse>
    error: CustomError | null
  }> = getAllCourses

  getCourse: (courseId: string) => Promise<any> = getCourse
}

export default CourseService

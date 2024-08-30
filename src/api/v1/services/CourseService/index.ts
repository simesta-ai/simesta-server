import { NextFunction, Request } from 'express'
import createCourse from './createCourse'
import getAllCourses from './getAllCourses'
import { ICourse } from '../../../../types'
import { CustomError } from '../../../../libs/utils/handlers/error'
import getCourse from './getCourse'

class CourseService {
  createCourse: (
    userId: string,
    title: string,
    files: any,
    subtopics: string[]
  ) => void = createCourse

  getAllCourses: (userId: string) => Promise<{
    coursesList: Array<ICourse>
    error: CustomError | null
  }> = getAllCourses

  getCourse: (courseId: string) => Promise<any> = getCourse
}

export default CourseService

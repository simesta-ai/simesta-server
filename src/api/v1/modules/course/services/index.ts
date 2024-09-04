import { CustomError } from '../../../../../libs/utils/handlers/error'
import { ICreateCourse } from '../../../../../types'
import createCourse from './createCourse'
import getAllCourses from './getAllCourses'
import getUserCourses, { ICourseResponse } from './getUserCourses'

class CourseService {
  create: ({ userId, title, files, subtopics }: ICreateCourse) => Promise<{
    courseId: string | null
    error: null | CustomError
  }> = createCourse

  getUserCourses: (userId: string) => Promise<{
    coursesList: Array<ICourseResponse>
    error: CustomError | null
  }> = getUserCourses

  getAllCourses: () => Promise<any> = getAllCourses
}

export default CourseService

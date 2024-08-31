import Course from '../../../../config/database/models/Course'
import { CustomError } from '../../../../libs/utils/handlers/error'
import { ICreateCourse } from '../../../../types'
import createCourse from './createCourse'
import getAllCourses from './getAllCourses'
// import  from './getUserCourses'
import getUserCourses, { ICourseResponse } from './getUserCourses'

class CourseService {
  createCourse: ({
    userId,
    title,
    files,
    subtopics,
  }: ICreateCourse) => Promise<{
    courseId: string | null
    error: null | CustomError
  }> = createCourse

  getUserCourses: (userId: string) => Promise<{
    coursesList: Array<ICourseResponse>
    error: CustomError | null
  }> = getUserCourses

  getAllCourses: () => Promise<Course[]> = getAllCourses
}

export default CourseService

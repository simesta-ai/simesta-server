import { ICourse, ICreateCourse } from '../../../../types'

import UserRepository from '../../../../config/database/repositories/UserRepository'
import AIGenerator from '../../../../libs/utils/services/aigenerator'
import { FileService } from '../../../../libs/utils/services/parseFile'
import TopicService from '../TopicService'
import CourseRepository from '../../../../config/database/repositories/CourseRepository'
import createCourse from './createCourse'

class CourseService {
  createCourse: ({ userId, title, files, subtopics }: ICreateCourse) => Promise<
    | {
        courseId: string
        error: null
      }
    | undefined
  > = createCourse
}

export default CourseService

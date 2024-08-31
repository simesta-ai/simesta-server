import { ICreateCourse, IUser } from '../../../types'
import Course from '../models/Course'

class CourseRepository {
  model = Course
  createCourse = async ({
    title,
    description,
    category,
    image,
    user,
    courseFiles,
  }: {
    title: string
    description: string
    category: string
    image: string
    user: string | IUser
    courseFiles?: any
  }): Promise<Course> => {
    const course = await this.model.create({
      title,
      description,
      category,
      image,
      user,
      courseFiles: courseFiles ? courseFiles : undefined,
    })
    return course
  }

  findById = async (id: string) => {
    const course = await this.model.findByPk(id)
    return course
  }
  find = async (query?: Record<string, any>) => {
    if (!query) {
      return await this.model.findAll()
    }
    const courses = await this.model.findAll({ where: query })
    return courses
  }

  updateOne = async ({
    id,
  }: {
    id: string
    updateInfo: Record<string, any>
  }) => {
    const updated = this.model.update({}, { where: { id } })
  }
}

export default CourseRepository

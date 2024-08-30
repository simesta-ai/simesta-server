import { ICreateCourse } from '../../../types'
import Course from '../models/Course'

class CourseRepository {
  model = Course
  createCourse = async ({
    title,
    description,
    category,
    image,
    user,
  }: any): Promise<Course> => {
    const course = await this.model.create({
      title,
      description,
      category,
      image,
      user,
    })
    return course
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

import CourseRepository from '../../../../config/database/repositories/CourseRepository'

const getAllCourses = async () => {
  const courseRepository = new CourseRepository()
  return await courseRepository.find()
}

export default getAllCourses

import CourseRepository from '../repository'

const getAllCourses = async () => {
  const courseRepository = new CourseRepository()
  return await courseRepository.find()
}

export default getAllCourses

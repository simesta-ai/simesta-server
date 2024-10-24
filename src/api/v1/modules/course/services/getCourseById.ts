import CourseRepository from "../repository"

const courseRepository = new CourseRepository()
const getCourseById = async (id: string) => {
    try {
      const course = await courseRepository.findCourseWithTopics(id)
    if (!course) {
      throw new Error('Course not found')
    }
    return course
    } catch (error) {
      throw error
    }
}

export default getCourseById

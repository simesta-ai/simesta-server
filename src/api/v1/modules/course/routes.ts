import express from 'express'
import upload from '../../../../libs/utils/services/multer'
import checkTotalFileSize from '../../../../libs/middlewares/validators/file.validator'
import CourseController from './controllers'
const router = express.Router()

const courseController = new CourseController()

router.route('/:userId/course').get(courseController.getUserCourses).post(
  // Create new course
  upload.array('files', 25),
  checkTotalFileSize,
  courseController.createCourse
)

router.get('/users/:userId', courseController.getUserCourses)

router.route('/:courseId/users/:userId').get(courseController.getCourseById).put().delete()

export default router

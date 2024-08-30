import express from 'express'
import UserController from '../controllers/UserController'
import upload from '../../../libs/utils/services/multer'
import checkTotalFileSize from '../../../libs/middlewares/validators/file.validator'
const router = express.Router()

const userController = new UserController()

router
  .route('')
  .get(
    // Get all courses
    userController.getAllCourses
  )
  .post(
    // Create new course
    upload.array('files', 25),
    checkTotalFileSize,
    userController.createCourse
  )

router
  .route('/:courseId')
  .get(userController.getCourse)
  .put
  // Update course by ID
  ()
  .delete
  // Delete course by ID
  ()

export default router

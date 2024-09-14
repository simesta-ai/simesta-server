import LectureController from './controllers'
import express from 'express'
const router = express.Router()
const lectureController = new LectureController()

router
  .route('/:courseId/topic/lecture/:lectureId')
  .post(lectureController.createLectureContent)
  .get(lectureController.getLectureContent)

// router
//   .route('/course/:courseId/topic/lecture/:lectureId')
//   .get(userController.getLecture) => get lectureContent
//   .post(userController.createLecture) => create lectureContent

export default router

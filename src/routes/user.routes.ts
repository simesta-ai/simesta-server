import express from 'express';
import UserController from '../controllers/UserController';
import upload from '../utils/services/multer';
import checkTotalFileSize from '../middlewares/validators/file.validator';

const router = express.Router();
const userController = new UserController();

// Create new course
router.post(
  '/:userId/create-course',
  upload.array('files', 25),
  checkTotalFileSize,
  userController.createCourse
);
router.get('/course/:courseId', userController.getCourse);
router.get('/:userId/courses', userController.getAllCourses);
router
  .route('/course/topic/:topicId')
  .get(userController.getTopic)
  .post(userController.createTopic);
router
  .route('/course/:courseId/topic/lecture/:lectureId')
  .get(userController.getLecture)
  .post(userController.createLecture);

export default router;

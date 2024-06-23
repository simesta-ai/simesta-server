import express from 'express'
import UserController from '../controllers/usercontroller/main'

const router = express.Router()
const userController = new UserController()

router.post("/create-course/:id", userController.createCourse)
router.get("/course/:courseId", userController.getCourse)
router.get("/:id/courses", userController.getAllCourses)
router.get("/course/topic/:topicId", userController.getTopic)
router.get("/course/topic/lecture/:lectureId", userController.getLecture)


export default router
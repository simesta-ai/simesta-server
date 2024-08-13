import express from "express";
import UserController from "../controllers/usercontroller/main";
import upload from "../utils/services/multer";
import checkTotalFileSize from "../middlewares/validators/file.validator";

const router = express.Router();
const userController = new UserController();

router.post(
  "/create-course/:id",
  upload.array("files", 25),
  checkTotalFileSize,
  userController.createCourse
);
router.get("/course/:courseId", userController.getCourse);
router.get("/:id/courses", userController.getAllCourses);
router.get("/course/topic/:topicId", userController.getTopic);
router.get("/course/topic/lecture/:lectureId", userController.getLecture);

export default router;

import express from 'express'
import UserController from '../controllers/usercontroller/main'

const router = express.Router()
const userController = new UserController()

router.post("/create-course/:email", userController.createCourse)


export default router
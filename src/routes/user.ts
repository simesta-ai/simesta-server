import express from "express"
import UserController  from '../controllers/users'

const router = express.Router()
const user = new UserController()

router.post('/create-course/:email', user.addCourse)


export default router;
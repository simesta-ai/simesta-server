import express from "express"
import AuthController from "../controllers/auth"

const router = express.Router()
const authenticator = new AuthController()

router.post('/signup', authenticator.signUp)
router.get('/login', authenticator.login)

export default router;
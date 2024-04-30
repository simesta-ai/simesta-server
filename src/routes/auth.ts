import express from "express"
import { signUp, logIn } from "../controllers/auth.js"

const router = express.Router()

router.post('/signup', signUp)
router.get('/login', logIn)

export default router;
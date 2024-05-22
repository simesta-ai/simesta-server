import express from "express"
import AuthController from "../controllers/authcontroller/auth.controller"

const router = express.Router()
const authenticator = new AuthController()

router.post("/signup", authenticator.register)
router.get("/login", authenticator.login)
router.get("/google", authenticator.googleSignIn)
router.get("/google/callback", authenticator.googleCallback)

export default router
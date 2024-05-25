import express from "express"
import passport from "passport";
import jwt from "jsonwebtoken";
import AuthController from "../controllers/authcontroller/auth.controller"

const router = express.Router()
const authenticator = new AuthController()

router.post("/signup", authenticator.register)
router.post("/login", authenticator.login)
router.get("/google", authenticator.googleSignIn)
router.get("/google/callback", authenticator.googleCallback)

export default router
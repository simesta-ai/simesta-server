import express from "express"
import passport from "passport";
import jwt from "jsonwebtoken";
import AuthController from "../controllers/authcontroller/auth.controller"
import Uservalidator from "../middlewares/validators/user.validator";

const router = express.Router()
const authenticator = new AuthController()
const userValidator = new Uservalidator()

router.post("/signup", authenticator.register, userValidator.validate)
router.post("/login", authenticator.login, userValidator.validate)
router.get("/google", authenticator.googleSignIn)
router.get("/google/callback", authenticator.googleCallback)

export default router
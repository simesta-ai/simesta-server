import express from "express";
import AuthController from "../controllers/AuthController";
import Uservalidator from "../middlewares/validators/user.validator";

const router = express.Router();
const authenticator = new AuthController();
const userValidator = new Uservalidator();

router.post("/signup", userValidator.validate, authenticator.register);
router.post("/login", userValidator.validate, authenticator.login);
router.get("/google", authenticator.googleSignIn);
router.get("/google/callback", authenticator.googleCallback);

export default router;

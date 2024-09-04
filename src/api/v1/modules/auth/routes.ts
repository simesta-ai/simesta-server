import express from 'express'
import AuthController from './controllers'
import Uservalidator from '../../../../libs/middlewares/validators/user.validator'

const router = express.Router()
const authController = new AuthController()
const userValidator = new Uservalidator()

router.post('/register', authController.register)
router.post('/login', authController.login)

// router.post('/signup', userValidator.validate, authController.register)
// router.get('/login', userValidator.validate, authController.login)
// router.get('/google', authController.googleSignIn)
// router.get('/google/callback', authController.googleCallback)

export default router

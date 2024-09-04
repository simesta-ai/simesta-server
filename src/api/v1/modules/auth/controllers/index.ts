import { Request, Response, NextFunction } from 'express'
import UserLoginService from './localauth/login'
import UserRegistrationService from './localauth/register'
import GoogleOAuthService from './oauth/googleOAuth'
import UserService from '../../user/services'
import AuthService from '../services'

const loginService = new UserLoginService()
const registrationService = new UserRegistrationService()
const googleAuthenticator = new GoogleOAuthService()

const userService = new UserService()
const authService = new AuthService()

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: 'Please provide valid credentials', success: false })
      }
      const user = authService.register({ name, email, password })
      if (!user)
        return res
          .status(400)
          .json({ message: 'User already exists', success: false })
      return res
        .status(201)
        .json({ message: 'User created successfully', success: true })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      if (!email || !password)
        return res
          .status(400)
          .json({
            message: 'Please provide all details for login',
            success: false,
          })
      const user = authService.login({ email, password })
      if (!user)
        return res
          .status(400)
          .json({ message: 'Invalid credentials', success: false })
      return res
        .status(200)
        .json({ message: 'User logged in successfully', success: true })
    } catch (error) {
      next(error)
    }
  }

  // LOGIN USER
  //   public async login(req: Request, res: Response, next: NextFunction) {
  //     loginService.loginUser(req, res, next)
  //   }

  //   // GOOGLE OAUTH
  //   public async googleSignIn(req: Request, res: Response, next: NextFunction) {
  //     googleAuthenticator.authenticateUser(req, res, next)
  //   }
  //   public async googleCallback(req: Request, res: Response, next: NextFunction) {
  //     googleAuthenticator.authenticationCallback(req, res, next)
  //   }
}

export default AuthController

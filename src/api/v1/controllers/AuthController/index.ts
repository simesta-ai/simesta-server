import { Request, Response, NextFunction } from 'express'
import UserLoginService from './localauth/login'
import UserRegistrationService from './localauth/register'
import GoogleOAuthService from './oauth/googleOAuth'
import UserService from '../../services/UserService'

const loginService = new UserLoginService()
const registrationService = new UserRegistrationService()
const googleAuthenticator = new GoogleOAuthService()

const userService = new UserService()

class AuthController {
  // REGISTER USER
  public async register(req: Request, res: Response, next: NextFunction) {
    registrationService.registerUser(req, res, next)
  }

  async register2(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body
    const user = userService.createUser({ name, email, password })
    if (!user) return res.status(400).json({ message: 'User already exists' })
    return res.status(201).json({ message: 'User created successfully' })
  }

  async login2(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body
    const user = userService.loginUser({ email, password })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    return res.status(200).json({ message: 'User logged in successfully
  }

  // LOGIN USER
  public async login(req: Request, res: Response, next: NextFunction) {
    loginService.loginUser(req, res, next)
  }

  // GOOGLE OAUTH
  public async googleSignIn(req: Request, res: Response, next: NextFunction) {
    googleAuthenticator.authenticateUser(req, res, next)
  }
  public async googleCallback(req: Request, res: Response, next: NextFunction) {
    googleAuthenticator.authenticationCallback(req, res, next)
  }
}

export default AuthController

/**
 * @file auth/controllers/index.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the authentication controllers for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/auth
 *
 * //@typedef {import('express').Request} Request
 * //@typedef {import('express').Response} Response
 * //@typedef {import('express').NextFunction} NextFunction
 * //@typedef {import('../services').default} AuthService
 */
import { Request, Response, NextFunction } from 'express'
import AuthService from '../services'
import jwt from 'jsonwebtoken'

const authService = new AuthService()

interface IResponseBody {
  message: string
  success: boolean
  data?: any
}

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    let responseBody: IResponseBody = {
      message: '',
      success: false,
      data: null,
    }

    try {
      console.log('Request made')
      const { name, email, password } = req.body
      const user = await authService.register({ name, email, password })
      if (!user || user === null) {
        responseBody = {
          ...responseBody,
          message: 'User already exists',
        }
        return res.status(400).json(responseBody)
      }
      const { password: unusedPassword, ...userWithoutPassword } = user

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        'secret',
        { expiresIn: '24h' }
      )
      res.cookie('Auth-token', token, { httpOnly: true, maxAge: 3600000 })
      responseBody = {
        data: userWithoutPassword,
        success: true,
        message: 'Successfully created user',
      }

      return res.status(201).json(responseBody)
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    let responseBody: IResponseBody = {
      message: '',
      success: false,
      data: null,
    }
    try {
      const { email, password } = req.body
      const user = await authService.login({ email, password })
      if (!user) {
        responseBody = { ...responseBody, message: 'Invalid Credentials ' }
        return res
          .status(401)
          .json({ message: 'Invalid credentials', success: false })
      }
      const { password: unusedPassword, ...userWithoutPassword } = user

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        'secret',
        { expiresIn: '24h' }
      )
      res.cookie('Auth-token', token, { httpOnly: true, maxAge: 3600000 })
      responseBody = {
        data: userWithoutPassword,
        success: true,
        message: 'Successfully logged in',
      }

      return res.status(200).json(responseBody)
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

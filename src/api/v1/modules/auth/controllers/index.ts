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
import { IResponseBody } from '../../../../../types'
import AuthService from '../services'
import jwt from 'jsonwebtoken'
import {
  ClientError,
  RedirectError,
  ServerError,
} from '../../../../../libs/utils/handlers/error'

const authService = new AuthService()

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body
      const { data, error } = await authService.register({
        name,
        email,
        password,
      })
      if (!data && !error) {
        throw new ClientError('Unable to create new user')
      }
      if (error) {
        next(error)
      } else {
        if (!data.emailVerified) {
          throw new RedirectError(
            `Please verify email address: ${data.email} to continue`
          )
        } else {
          req['user'] = data
        }
        next()
      }
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const { data, error } = await authService.login({ email, password })
      if (!data && !error) {
        throw new ClientError('Unable to fetch user')
      }
      if (error) {
        next(error)
      } else {
        if (!data.emailVerified) {
          throw new RedirectError(
            `Please verify email address: ${data.email} to continue`
          )
        } else {
          req['user'] = data
        }
        next()
      }
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy((err) => {
        if (err) {
          throw new ClientError(
            'Unable to logout user: Session destruction error'
          )
        }
      })
      next()
    } catch (error) {
      next(error)
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params
      if (!email) {
        throw new Error('Email address is required')
      }
      const { error, data } = await authService.sendVerificationEmail(email)
      if (error) {
        throw error
      }
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body
      if (!otp || !email) {
        throw new Error('Email address and OTP are required')
      }
      const { error, data } = await authService.verifyOtp(email, otp)
      if (!data?.user) {
        throw new ServerError('Unable to verify OTP, please try again.')
      }
      if (error) {
        throw error
      } else {
        if (!data.user.emailVerified) {
          throw new RedirectError(
            `Please verify email address: ${data.user.email} to continue`
          )
        } else {
          req['user'] = data.user
        }
        next()
      }
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController

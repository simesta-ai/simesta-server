/**
 * @file auth/routes.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the authentication routes for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/auth
 *
 * //@typedef {import('express').Router} Router
 * //@typedef {import('./controllers').default} AuthController
 * //@typedef {import('../../../../libs/middlewares/validators/user.validator').default} UserValidator
 */

import express, { NextFunction, Response } from 'express'
import AuthController from './controllers'
import Uservalidator from '../../../../libs/middlewares/validators/user.validator'
import JwtService, { IJwt } from '../../../../libs/utils/services/jwt'
import { AuthError } from '../../../../libs/utils/handlers/error'
import { RequestWithUser } from '../../../../types'

const router = express.Router()
const authController = new AuthController()
const userValidator = new Uservalidator()
const jwtService = new JwtService()

const authResponse = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user
    if (!user) {
      throw new AuthError("Unable to login user because user doesn't exist")
    }
    if (user.message == 'Please verify email address to continue') {
      res.status(200).json({
        status: 'success',
        email: user.email,
        message: user.message,
      })
    } else {
      res.status(200).json({
        status: 'success',
        data: user,
        messsage: 'User authentication successful',
      })
    }
  } catch (error) {
    next(error)
  }
}

// LOCAL AUTH ROUTES
router.post(
  '/register',
  userValidator.validate,
  authController.register,
  jwtService.grantToken,
  jwtService.isLoggedIn,
  authResponse
)
router.post(
  '/login',
  userValidator.validate,
  authController.login,
  jwtService.grantToken,
  jwtService.isLoggedIn,
  authResponse
)
router.get(
  '/logout',
  authController.logout,
  jwtService.invalidateToken,
  (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'User logged out successfully',
    })
  }
)

// VERIFICATION ROUTES
router.get(
  '/verify/email/:email',
  authController.verifyEmail
)
router.post('/verify/otp', authController.verifyOtp, jwtService.grantToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User verified successfully',
    data: req.user
  })
})

export default router

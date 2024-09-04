import express from 'express'
import passport from 'passport'
import { AuthError } from '../../../../../../libs/utils/handlers/error'

export interface IGoogleService {
  authenticateUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void
  authenticationCallback(req: any, res: any, next: any): void
}

class GoogleOAuthService implements IGoogleService {
  // Authenticate user with their google account
  authenticateUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate('google', {
      session: true,
      scope: ['email', 'profile'],
    })(req, res, next)
  }

  // Callback for google authentication
  authenticationCallback(req: any, res: any, next: any) {
    passport.authenticate(
      'google',
      { session: true },
      (err: any, user: any, info: any) => {
        try {
          if (err) {
            throw new AuthError(info.message)
          }
          if (!user) {
            throw new AuthError(info.message)
          } else {
            req.logIn(user, (err: any) => {
              if (err) {
                throw new AuthError(info.message)
              }
              next()
            })
          }
        } catch (error) {
          next(error)
        }
      }
    )(req, res, next)
  }
}

export default GoogleOAuthService

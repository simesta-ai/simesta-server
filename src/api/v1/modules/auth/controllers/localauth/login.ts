import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { AuthError } from '../../../../../../libs/utils/handlers/error'

export interface ILoginService {
  loginUser(req: Request, res: Response, next: NextFunction): void
}

class UserLoginService implements ILoginService {
  public async loginUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('login', (err: any, user: any, info: any) => {
      try {
        if (err) {
          throw new AuthError(info.message)
        }
        if (!user) {
          throw new AuthError('User could not be found while trying to login')
        } else {
          req.logIn(user, (err) => {
            if (err) {
              throw new AuthError(
                'Error logging in user to session, please retry process'
              )
            }
            next()
          })
        }
      } catch (error) {
        next(error)
      }
    })(req, res, next)
  }
}

export default UserLoginService

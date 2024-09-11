import express, { ErrorRequestHandler, NextFunction, Response } from 'express'
import authRoutes from '../modules/auth/routes'
import userRoutes from '../modules/user/routes'
import courseRoutes from '../modules/course/routes'
import chatRoutes from '../modules/chat/routes'
import JwtService, { IJwt } from '../../../libs/utils/services/jwt'
import { AuthError } from '../../../libs/utils/handlers/error'
import { errorHandler } from '../../../libs/utils/handlers/error'
import { RequestWithUser } from '../../../types'

class Router {
  private app: express.Application
  private jwtService: IJwt

  constructor(app: express.Application) {
    this.app = app
    this.jwtService = new JwtService()
  }

  private isLoggedIn(
    req: RequestWithUser,
    res: Response,
    next: express.NextFunction
  ) {
    try {
      if (req.user) {
        next()
      } else {
        throw new AuthError('User is not logged in')
      }
    } catch (error) {
      next(error)
    }
  }

  public configAuthRoutes() {
    this.app.use(
      '/auth',
      authRoutes,
      // this ensures that the there is a user before proceeding
      this.isLoggedIn,

      this.jwtService.grantToken,
      (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
          const user = req.user
          if (!user) {
            throw new AuthError(
              "Unable to login user because user doesn't exist"
            )
          }
          res
            .status(200)
            .json({
              data: { id: user._id, name: user.name },
              messsage: 'User created',
            })
        } catch (error) {
          next(error)
        }
      }
    )
  }

  public configUserRoutes() {
    this.app.use('/users', this.jwtService.verifyToken, userRoutes)
    // this.app.use(errorHandler)
  }

  public configureCourseRoutes() {
    this.app.use('/courses', courseRoutes)
  }
  public configureChatRoutes() {
    this.app.use('/chat', chatRoutes)
    this.app.use(errorHandler)
  }
}

export default Router

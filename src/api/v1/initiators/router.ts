import express from 'express'
import authRoutes from '../modules/auth/routes'
import userRoutes from '../modules/user/routes'
import courseRoutes from '../modules/course/routes'
import lectureRoutes from '../modules/lecture/routes'
import topicRoutes from '../modules/topic/routes'
import chatRoutes from '../modules/chat/routes'
import JwtService, { IJwt } from '../../../libs/utils/services/jwt'
import { errorHandler } from '../../../libs/utils/handlers/error'

class Router {
  private app: express.Application
  private jwtService: IJwt

  constructor(app: express.Application) {
    this.app = app
    this.jwtService = new JwtService()
  }

  public configAuthRoutes() {
    this.app.use(
      '/auth',
      authRoutes,
    )
  }

  public configUserRoutes() {
    this.app.use('/users', this.jwtService.verifyToken, userRoutes)
    // this.app.use(errorHandler)
  }

  public configureCourseRoutes() {
    this.app.use('/courses', courseRoutes)
    this.app.use('/courses', topicRoutes)
    this.app.use('/courses', lectureRoutes 
    )
  }
  public configureChatRoutes() {
    this.app.use('/chat', chatRoutes)
    this.app.use(errorHandler)
  }
}

export default Router

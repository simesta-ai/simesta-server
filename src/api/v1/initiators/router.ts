import express from 'express'
import authRoutes from '../modules/auth/routes'
import userRoutes from '../modules/user/routes'
import courseRoutes from '../modules/course/routes'
import topicRoutes from '../modules/topic/routes'
import lectureRoutes from '../modules/lecture/routes'
import chatRoutes from '../modules/chat/routes'
import notificationRoutes from '../modules/notifications/routes'
import JwtService, { IJwt } from '../../../libs/utils/services/jwt'
import { errorHandler } from '../../../libs/utils/handlers/error'
import recommendationsRouter from '../modules/recommendations/recommendations.router'

class Router {
  private app: express.Application
  private jwtService: IJwt

  constructor(app: express.Application) {
    this.app = app
    this.jwtService = new JwtService()
  }

  public configRootRoutes() {
    this.app.get('/', (req: express.Request, res: express.Response) => {
      res.send(
        'Simesta API - Visit https://github.com/simesta-ai/simesta-server for usage.'
      )
    })
  }

  public configAuthRoutes() {
    this.app.use('/api/auth', authRoutes)
  }

  public configUserRoutes() {
    this.app.use('/api/users', this.jwtService.verifyToken, userRoutes)
  }

  public configureCourseRoutes() {
    this.app.use('/api/courses', this.jwtService.verifyToken, courseRoutes)
    this.app.use('/api/courses', this.jwtService.verifyToken, topicRoutes)
    this.app.use('/api/courses', this.jwtService.verifyToken, lectureRoutes)
  }
  public configureNotificationRoutes() {
    this.app.use(
      '/api/notifications',
      this.jwtService.verifyToken,
      notificationRoutes
    )
  }
  public configureRecommendationRoutes() {
    this.app.use('/api/recommendations', recommendationsRouter)
  }
  public configureChatRoutes() {
    this.app.use('/api/chat', chatRoutes)
  }
}

export default Router

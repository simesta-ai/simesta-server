import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import session from 'express-session'
import cookiepParser from 'cookie-parser'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import dotenv from 'dotenv'
import ApiRouter from './router'
import { initializeRedis } from '../../../libs/utils/services/redis'
import logger from '../../../libs/utils/logger'
import swaggerUi from 'swagger-ui-express'
import { documentationSetup } from '../docs/setup'
import {
  dailyNotifications,
  triDailyNotifications,
} from '../modules/notifications/services/notificationCron'
import { dailyStreakMonitoring } from '../modules/user/services/streaksCron'
import { errorHandler } from '../../../libs/utils/handlers/error'

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

interface IcorsOptions {
  origin: string
  credentials: boolean
  methods: string[]
  allowHeaders: string[]
}

class AppController {
  private app: express.Application
  private port: string | number
  private readonly corsOptions: IcorsOptions

  constructor(app: express.Application, port: string | number) {
    this.app = app
    this.port = port
    this.corsOptions = {
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Credentials',
      ],
    }
  }

  private configureLimiter() {
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
      })
    )
  }

  private setupDocumentation() {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(documentationSetup))
  }

  private sessionConfig() {
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
      })
    )
  }

  private configureRouting() {
    const appRouter = new ApiRouter(this.app)
    appRouter.configRootRoutes()
    appRouter.configAuthRoutes()
    appRouter.configUserRoutes()
    appRouter.configureCourseRoutes()
    appRouter.configureChatRoutes()
    appRouter.configureNotificationRoutes()
    this.app.use(errorHandler)
  }
  private setupCronJobs() {
    dailyNotifications.start()
    triDailyNotifications.start()
    dailyStreakMonitoring.start()
  }

  // Setup Express Middlewares
  private enableMiddlewares() {
    this.app.use(helmet())
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    )
    this.sessionConfig()
    this.configureLimiter()
    this.app.use(cookiepParser())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(cors(this.corsOptions))
  }

  // Connect to Redis data-store
  private setupRedis() {
    initializeRedis()
  }

  // Initialize Application
  public startApp() {
    this.enableMiddlewares()
    this.configureRouting()
    this.setupCronJobs()
    this.setupDocumentation()
    this.setupRedis()
    return this.app.listen(this.port, () => {
      logger.info(`Server listening on the port ${this.port}`)
    })
  }
}

export default AppController

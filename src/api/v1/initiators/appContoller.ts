import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import session from 'express-session'
import cookiepParser from 'cookie-parser'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import passport from 'passport'
import dotenv from 'dotenv'
import Router from './router'
import RedisService from '../../../libs/utils/services/redis'
import logger from '../../../libs/utils/logger'
require('../../../libs/middlewares/authenticators/localauth')
require('../../../libs/middlewares/authenticators/oauth')
import swaggerUi from 'swagger-ui-express'
import { documentationSetup } from '../docs/setup'

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

interface IcorsOptions {
  origin: string
  credentials: boolean
  methods: string[]
  allowHeaders: string[]
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)

  const responseBody = {
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '' : error.stack,
  }
  logger.error('Error', responseBody)
  res.json(responseBody)
}

class AppController {
  private app: express.Application
  private port: string
  private readonly corsOptions: IcorsOptions

  constructor(app: express.Application, port: string) {
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
        cookie: { secure: false },
      })
    )
  }

  private configureRouting() {
    const appRouter = new Router(this.app)
    appRouter.configAuthRoutes()
    appRouter.configUserRoutes()
    appRouter.configureCourseRoutes()
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

    this.app.use(passport.initialize())
    this.app.use(passport.session())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(cors(this.corsOptions))
  }

  // Connect To Database
  //   private async setupDatabase(): Promise<boolean> {
  //     try {
  //       await AppDataSource.initialize()
  //       const createUser = async () => {
  //         const user = new User()
  //         user.name = 'Kingsley'
  //         user.email = 'king@email.com'
  //         user.password = '12345678'
  //         await AppDataSource.manager.save(user)
  //       }

  //       createUser()
  //       console.log(AppDataSource)
  //       //   await dbConnection.authenticate()
  //       //   await dbConnection.sync()
  //       //   addTopicContraints(dbConnection)
  //       logger.info(
  //         'Connection to the database has been established successfully.'
  //       )
  //       return true
  //     } catch (error) {
  //       logger.error('Unable to connect to the database:', error)
  //       return false
  //     }
  //   }

  // Connect to Redis data-store
  private setupRedis() {
    const redisService = new RedisService(
      process.env.REDIS_SECRET,
      process.env.REDIS_HOST,
      Number(process.env.REDIS_PORT)
    )
    redisService.createConnection()
  }

  // Initialize Application
  public startApp() {
    this.enableMiddlewares()
    this.configureRouting()
    this.setupDocumentation()
    this.setupRedis()
    this.app.listen(this.port, () => {
      logger.info(`Server listening on the port ${this.port}`)
    })
    // this.setupDatabase()
    //   .then((connected) => {
    //     if (connected) {

    //     } else {
    //       throw new ServerError('Unable to connect to the database')
    //     }
    //   })
    //   .catch((error) => {
    //     logger.error('Error starting server: ', error)
    //   })
    this.app.use(errorHandler)
  }
}

export default AppController

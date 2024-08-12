import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import session from "express-session";
import cookiepParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import passport from "passport";
import dotenv from "dotenv";
import Router from "./router";
import RedisService from "../utils/services/redis";
require("../middlewares/authenticators/localauth");
require("../middlewares/authenticators/oauth");

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config();

interface IcorsOptions {
  origin: string;
  credentials: boolean;
  methods: string[];
  allowHeaders: string[];
}

class AppController {
  private app: express.Application;
  private port: string;
  private readonly corsOptions: IcorsOptions;

  constructor(app: express.Application, port: string) {
    this.app = app;
    this.port = port;
    this.corsOptions = {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
      ],
    };
  }

  private configureLimiter() {
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
      })
    );
  }

  private sessionConfig() {
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    );
  }

  private configureRouting() {
    const appRouter = new Router(this.app);
    appRouter.configAuthRoutes();
    appRouter.configUserRoutes()
  }

  // Setup Express Middlewares
  private enableMiddlewares() {
    this.app.use(helmet());
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    );
    this.sessionConfig();
    this.configureLimiter();
    this.app.use(cookiepParser());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  // Connect To Database
  private async setupDatabase(): Promise<typeof mongoose> {
    const db = await mongoose.connect(process.env.MONGODB_URL as string);
    return db;
  }

  // Connect to Redis data-store
  private setupRedis() {
    const redisService = new RedisService(
      process.env.REDIS_SECRET,
      process.env.REDIS_HOST,
      Number(process.env.REDIS_PORT)
    );
    redisService.createConnection();
  }

  // Initialize Application
  public startApp() {
    this.enableMiddlewares();
    this.configureRouting();
    // this.setupRedis();
    this.setupDatabase()
      .then((db) => {
        this.app.listen(this.port, () => {
          console.log(`Server listening on the port ${this.port}`);
        });
      })
      .catch((error) => {
        console.log("Error starting server");
      });
  }
}

export default AppController;

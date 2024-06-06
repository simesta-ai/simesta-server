import express, { IRouter } from "express";
import jwt from "jsonwebtoken";
import authRoutes from "../routes/auth.routes";
import JwtService, { IJwt } from "../utils/services/jwtService";
import Uservalidator from "../middlewares/validators/user.validator";
import { AuthError } from "../utils/handlers/error";
import { errorHandler } from "../utils/handlers/error";

class Router {
  private app: express.Application;
  private jwtService: IJwt;
  private userValidator: Uservalidator;

  constructor(app: express.Application) {
    this.app = app;
    this.jwtService = new JwtService();
    this.userValidator = new Uservalidator();
  }

  private isLoggedIn(
    req: any,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      if (req.user) {
        next();
      } else {
        throw new AuthError("User is not logged in");
      }
    } catch (error) {
      next(error);
    }
  }

  public configAuthRoutes() {
    this.app.use(
      "/auth",
      authRoutes,
      this.userValidator.validate,
      this.isLoggedIn,
      this.jwtService.grantToken,
      (req: any, res) => {
        const user = req.user;
        res.status(200).json({ id: user._id, name: user.name });
      }
    );
    this.app.get("/", (req, res) => {
      res.send('<a href="/auth/google">Authenticate with Google</a>');
    });
    this.app.use(errorHandler);
  }
}

export default Router;

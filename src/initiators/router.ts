import express, { ErrorRequestHandler, NextFunction, Response } from "express";
import authRoutes from "../routes/auth.routes";
import userRoutes from "../routes/user.routes";
import JwtService, { IJwt } from "../utils/services/jwt";
import { AuthError } from "../utils/handlers/error";
import { errorHandler } from "../utils/handlers/error";
import { RequestWithUser } from "../types";

class Router {
  private app: express.Application;
  private jwtService: IJwt;

  constructor(app: express.Application) {
    this.app = app;
    this.jwtService = new JwtService();
  }

  private isLoggedIn(
    err: Error,
    req: RequestWithUser,
    res: Response,
    next: express.NextFunction
  ) {
    try {
      if (err) {
        next(err);
      }
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
      this.isLoggedIn,
      this.jwtService.grantToken,
      (err: Error, req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
          if (err) {
            next(err);
          }
          const user = req.user;
          if (!user) {
            throw new AuthError(
              "Unable to login user because user doesn't exist"
            );
          }
          res.status(200).json({ id: user._id, name: user.name });
        } catch (error) {
          next(error);
        }
      }
    );
  }

  public configUserRoutes() {
    this.app.use("/users", this.jwtService.verifyToken, userRoutes);
    this.app.use(errorHandler);
  }
}

export default Router;

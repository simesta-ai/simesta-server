import express from "express";
import passport from "passport";
import { AuthError } from "../../../utils/handlers/error";

export interface IRegisterService {
  registerUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void;
}

class UserRegistrationService implements IRegisterService {
  registerUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate("signup", (err: any, user: any, info: any) => {
      try {
        if (err) {
          throw new AuthError(info.message);
        }
        if (!user) {
          throw new AuthError(info.message);
        } else {
          req.logIn(user, (err) => {
            if (err) {
              throw new AuthError(info.message);
            }
            next();
          });
        }
      } catch (error) {
        next(error);
      }
    })(req, res);
  }
}

export default UserRegistrationService;

import { Request, Response, NextFunction} from "express";
import passport from "passport";
import { AuthError } from "../../../utils/handlers/error";

export interface IRegisterService {
  registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}

class UserRegistrationService implements IRegisterService {
  registerUser(
    req: Request,
    res: Response,
    next: NextFunction
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
              throw new AuthError("Error logging in user to session after signup, please retry process");
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

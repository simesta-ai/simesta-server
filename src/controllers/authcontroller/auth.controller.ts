import express from "express";
import passport from "passport";
import { AuthError } from "../../utils/handlers/error";


class AuthController {
  // REGISTER USER
  public async register(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate(
      "signup", 
      (err: any, user: any, info: any) => {
        try {
          if(err){
            throw new AuthError(info.message)
          }
          if(!user) {
            throw new AuthError(info.message)
          } else {
            req.logIn(user, (err) => {
              if(err){
                throw new AuthError(info.message)
              }
              next()
            })
            
          }
        } catch (error) {
          next(error)
        }
      }
    )(req, res);
  }

  // LOGIN USER
  public async login(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate(
      "login",
      (err: any, user: any, info: any) => {
        try {
          if(err){
            throw new AuthError(info.message)
          }
          if(!user) {
            throw new AuthError(info.message)
          } else {
            req.logIn(user, (err) => {
              if(err){
                throw new AuthError(info.message)
              }
              next()
            })
            
          }
        } catch (error) {
          next(error)
        }
      }
    )(req, res, next);
  }

  // GOOGLE OAUTH
  public async googleSignIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    
    passport.authenticate('google', { session: true, scope: ["email", "profile"] })(req, res, next);
  }
  public async googleCallback(
    req: any,
    res: any,
    next: any
  ) {
    passport.authenticate(
      "google",
      { session: true },
      (err: any, user: any, info: any) => {
        try {
          if(err){
            throw new AuthError(info.message)
          }
          if(!user) {
            throw new AuthError(info.message)
          } else {
            req.logIn(user, (err: any) => {
              if(err){
                throw new AuthError(info.message)
              }
              next()
            })
            
          }
        } catch (error) {
          next(error)
        }
      }
    )(req, res, next) 
  }
}

export default AuthController;

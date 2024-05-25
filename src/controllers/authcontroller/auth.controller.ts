import express from "express";
import passport from "passport";


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
        if(err){
          res.status(400).json(info)
        }
        if(!user) {
          res.status(400).json(info)
        } else {
          req.logIn(user, (err) => {
            if(err){
              res.status(400).json(info)
            }
            next()
          })
          
        }
      }
    )(req, res);
  }

  // LOGIN USER
  public async login(
    req: express.Request,
    res: express.Response,
    next: any
  ) {
    passport.authenticate(
      "login",
      (err: any, user: any, info: any) => {
        if(err){
          res.status(400).json(info)
        }
        if(!user) {
          res.status(400).json(info)
        } else {
          req.logIn(user, (err) => {
            if(err){
              res.status(400).json(info)
            }
            next()
          })
          
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
        if(err){
          res.status(400).json(info)
        }
        if(!user) {
          res.status(400).json(info)
        } else {
          req.logIn(user, (err: any) => {
            if(err){
              res.status(400).json(info)
            }
            next()
          })
          
        }
      }
    )(req, res, next) 
  }
}

export default AuthController;

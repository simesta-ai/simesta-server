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
      "signup", { failureRedirect: "/login", successRedirect: "/dashboard" }
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
      { failureRedirect: "/login", successRedirect: "/dashboard" },
      
    )(req, res);
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
      { failureRedirect: "/", successRedirect: "/dashboard", session: true },
    )(req, res) 
  }
}

export default AuthController;

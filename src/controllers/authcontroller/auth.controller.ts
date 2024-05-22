import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

class AuthController {
  // REGISTER USER
  public async register(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate(
      "signup",
      (err: Error | null, user: any, info?: { message: string }) => {
        res.json({ message: "User registered successfully" });
      }
    )(req, res, next);
  }

  // LOGIN USER
  public async login(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate(
      "login",
      { failureRedirect: "/login" },
      (err: Error | null, user: any, info?: { message: string }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(400).json({ message: "User does not exist" });
        }
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          const token = jwt.sign(
            { data: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "24h" }
          );
          res.cookie("Auth-token", token, { httpOnly: true, maxAge: 3600000 });
          return res.json("Logged In Successfully");
        });
      }
    )(req, res, next);
  }

  // GOOGLE OAUTH
  public async googleSignIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    console.log("g started");
    passport.authenticate("google", { scope: ["email", "profile"] });
  }
  public async googleCallback(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate(
      "google",
      { failureRedirect: "/", successRedirect: "/protected" },
      (err: Error | null, user: any, info?: { message: string }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(400).json({ message: "User does not exist" });
        }
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          const token = jwt.sign(
            { data: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "24h" }
          );
          res.cookie("Auth-token", token, { httpOnly: true, maxAge: 3600000 });
          return res.send("Logged In Successfully");
        });
      }
    );
  }
}

export default AuthController;

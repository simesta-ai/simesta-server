
import {Request, Response, NextFunction } from "express";
import UserLoginService from "./localauth/login";
import UserRegistrationService from "./localauth/register";
import GoogleOAuthService from "./oauth/googleOAuth";

const loginService = new UserLoginService();
const registrationService = new UserRegistrationService();
const googleAuthenticator = new GoogleOAuthService()

class AuthController {

  // REGISTER USER
  public async register(err: Error, req:Request, res: Response, next: NextFunction) {
    if(err){
      next(err)
    }
    registrationService.registerUser(req, res, next)
  }

  // LOGIN USER
  public async login(err: Error, req:Request, res: Response, next: NextFunction) {
    if(err){
      next(err)
    }
    loginService.loginUser(req, res, next)
  }

  // GOOGLE OAUTH
  public async googleSignIn(req:Request, res: Response, next: NextFunction) {
     googleAuthenticator.authenticateUser(req, res, next)
  }
  public async googleCallback(req:Request, res: Response, next: NextFunction) {
     googleAuthenticator.authenticationCallback(req, res, next)
  }
}

export default AuthController;

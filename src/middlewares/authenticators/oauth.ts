import express from "express"
import passport, { Profile } from "passport";
import dotenv from "dotenv"
import GoogleStrategy, { VerifyCallback } from "passport-google-oauth2"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.ts";


// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

// GOOGLE AUTHENTICATION
const googleStrategy = GoogleStrategy.Strategy;
passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            passReqToCallback: true
        },
       async  (request: express.Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
            try {
                    
                    const user = await User.findOne({ email: profile.email })
                    if(user) {
                        done(null, user)
                    } else {
                        const newUser = new User({
                            name: profile.displayName,
                            email: profile.email,
                            password: bcrypt.hashSync(profile.id, 10)
                        })
                        const savedUser = await newUser.save()

                        const userDetails = {
                            id: savedUser._id,
                            name: savedUser.name,
                            email: savedUser.email
                        }
                        done(null, userDetails)
                    }
                
            } catch (error) {
                done(error)
            }
        }
        
    )
)

passport.serializeUser((user: any, done) => {
    done(null, user.email);
  });
  
  passport.deserializeUser(async (email: string, done) => {
    const user: any = await User.findOne({ email : email });
    if(user){
        done(null, user);
    } else {
        done(null)
    }
  });
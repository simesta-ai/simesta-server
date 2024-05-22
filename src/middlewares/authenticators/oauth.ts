import express from "express"
import passport, { Profile } from "passport";
import dotenv from "dotenv"
import GoogleStrategy, { VerifyCallback } from "passport-google-oauth2"
import bcrypt from "bcrypt";
import User from "../../models/user.model.ts";

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()


const googleStrategy = GoogleStrategy.Strategy;
passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:3000/api/auth/google/callback',
            passReqToCallback: true
        },
        (request: express.Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
            try {
                console.log(profile)
                User.findOne({ email: profile.email }, (err: any, user: any) => {
                    if(err){
                        done(err)
                    }
                    if(user){
                        done(null, user)
                    } else {
                        bcrypt.hash(profile.id, 10, async (err, hash) => {
                            if(err){
                                done(err)
                            } else {
                                const newUser = new User({
                                    name: profile.displayName,
                                    email: profile.email,
                                    password: hash
                                })
                                const savedUser = await newUser.save()
                                return done(null, savedUser)
                            }
                        })
                    }
                })
            } catch (error) {
                done(error)
            }
        }
        
    )
)

passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((_id, done) => {
    User.findById(_id, (err: Error, user: typeof User) => { 
        done(err, user);
    });
  });
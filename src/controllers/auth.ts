import { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from '../models/User.js'
const saltRounds = 10;


// REGISTER STUDENT

export const signUp = (req: Request, res: Response) => {
    const {
        name,
        email,
        password
    } = req.body

}

// LOGIN STUDENT

export const logIn = (req: Request, res: Response) => {
    const {
        email,
        password
    } = req.body

}
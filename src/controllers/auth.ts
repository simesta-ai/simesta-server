import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.ts";
const saltRounds = 10;


class AuthController {

  // REGISTER STUDENT
  public async signUp(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          res.status(500).json({ message: "Internal server error" });
        } else {
          const newUser = new User({
            name,
            email,
            password: hash,
          });
          // Save the user to the database
          const savedUser = await newUser.save();
          res.status(201).json(savedUser);
        }
      });
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // LOGIN STUDENT
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email })
          if (!user) return res.status(400).json({ msg: "User does not exist." })
  
          bcrypt.compare(password, user.password, async function(err, result) {
              if(result){
                  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                  // delete user?.password;
                  res.status(200).json(user)
              } else {
                  res.status(500).json({ msg: "Invalid Credentials" })
              }
          }
      );
      
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal server error" });
      
    }
  }

}


export default AuthController;

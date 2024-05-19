import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.ts";
import IUser from "../classes/user.ts"
import Course from "../models/Course.ts"
import Topic from "../models/Topic.ts";
import Lecture from "../classes/lectures.ts";
import generators from "../generators/generate.ts";
import { createLecture } from "../utilities.ts";





// User 
class UserController {


    public async addCourse(req: Request, res: Response){
      try {
        const videos = await createLecture("Intro to data analysis")
        const videoIds: string[] = []
        if(videos.data.items){
          videos.data.items.forEach((video) => {
            const id = video.id!.videoId as string
            videoIds.push(id)
          })
        }
        

      res.status(200).json(videoIds)
      } catch (error) {
        res.status(500).json("Internal server error")
      }
        
    }
  }

export default UserController

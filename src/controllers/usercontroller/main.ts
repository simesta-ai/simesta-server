import { Request, Response, NextFunction } from "express";
import CourseController from "./course/coursecontroller";
import { ServerError } from "../../utils/handlers/error";

const courseService = new CourseController

class UserController {
    
    async createCourse(req: Request, res: Response, next: NextFunction) {
        try{
            await courseService.createCourse(req, res, next);
        }catch(error){
            throw new ServerError("Trouble creating course")
        }
    }

}

export default UserController
import { Request, Response, NextFunction } from "express";
import CourseController from "./course/coursecontroller";
import ProfileController from "./profile/profilecontroller";
import QuizController from "./quiz/quizcontroller";
import { ServerError } from "../../utils/handlers/error";

const courseService = new CourseController;
const profileService = new ProfileController;
const quizService = new QuizController;

class UserController {
    
    async createCourse(req: Request, res: Response, next: NextFunction) {
        try{
            await courseService.createCourse(req, res, next);
        }catch(error){
            throw new ServerError("Trouble creating course")
        }
    }
    async getCourse(req: Request, res: Response, next: NextFunction) {
        try{
            await courseService.getCourse(req, res, next);
        }catch(error){
            throw new ServerError("Trouble fetching course")
        }
    }
    async getTopic(req: Request, res: Response, next: NextFunction) {
        try{
            await courseService.getTopic(req, res, next);
        }catch(error){
            throw new ServerError("Trouble fetching topic")
        }
    }
    async getLecture(req: Request, res: Response, next: NextFunction) {
        try{
            await courseService.getLecture(req, res, next);
        }catch(error){
            throw new ServerError("Trouble fetching lecture")
        }
    }
    async getAllCourses(req: Request, res: Response, next: NextFunction) {
        try{
            await courseService.getAllCourses(req, res, next);
        }catch(error){
            throw new ServerError("Trouble fetching courses")
        }
    }
    async getUserProfile() {}
    async createQuiz() {}

}

export default UserController
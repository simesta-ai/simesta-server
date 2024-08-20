import { Request, Response, NextFunction } from "express";
import CourseController from "../CourseController";
import { ServerError } from "../../utils/handlers/error";

const courseService = new CourseController();

class UserController {
  async createCourse(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err){
      next(err)
    }
    await courseService.createCourse(req, res, next);
  }
  async getCourse(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err){
      next(err)
    }
    await courseService.getCourse(req, res, next);
  }
  async createTopic(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err){
      next(err)
    }
    await courseService.createTopic(req, res, next);
  }
  async getTopic(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err){
      next(err)
    }
    await courseService.getTopic(req, res, next);
  }
  async createLecture(err: Error, req: Request, res: Response, next: NextFunction){
    if(err){
      next(err)
    }
    await courseService.createLecture(req, res, next);
  }
  async getLecture(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err){
      next(err)
    }
    await courseService.getLecture(req, res, next);
  }
  async getAllCourses(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err){
      next(err)
    }
    await courseService.getAllCourses(req, res, next);
  }
}

export default UserController;

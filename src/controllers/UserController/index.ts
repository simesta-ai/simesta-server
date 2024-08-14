import { Request, Response, NextFunction } from "express";
import CourseController from "../CourseController";
import { ServerError } from "../../utils/handlers/error";

const courseService = new CourseController();

class UserController {
  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.createCourse(req, res, next);
    } catch (error) {
      throw new ServerError("Trouble creating course");
    }
  }
  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.getCourse(req, res, next);
    } catch (error) {
      throw new ServerError("Trouble fetching course");
    }
  }
  async getTopic(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.getTopic(req, res, next);
    } catch (error) {
      throw new ServerError("Trouble fetching topic");
    }
  }
  async getLecture(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.getLecture(req, res, next);
    } catch (error) {
      throw new ServerError("Trouble fetching lecture");
    }
  }
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.getAllCourses(req, res, next);
    } catch (error) {
      throw new ServerError("Trouble fetching courses");
    }
  }
}

export default UserController;

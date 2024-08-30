import { Request, Response, NextFunction } from 'express'
import CourseController from '../CourseController'
import { ServerError } from '../../../../libs/utils/handlers/error'

const courseService = new CourseController()

class UserController {
  async createCourse(req: Request, res: Response, next: NextFunction) {
    await courseService.createCourse(req, res, next)
  }
  async getCourse(req: Request, res: Response, next: NextFunction) {
    await courseService.getCourse(req, res, next)
  }
  async createTopic(req: Request, res: Response, next: NextFunction) {
    await courseService.createTopic(req, res, next)
  }
  async getTopic(req: Request, res: Response, next: NextFunction) {
    await courseService.getTopic(req, res, next)
  }
  async createLecture(req: Request, res: Response, next: NextFunction) {
    await courseService.createLecture(req, res, next)
  }
  async getLecture(req: Request, res: Response, next: NextFunction) {
    await courseService.getLecture(req, res, next)
  }
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    await courseService.getAllCourses(req, res, next)
  }
}

export default UserController

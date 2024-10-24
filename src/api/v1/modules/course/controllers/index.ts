/**
 * @author Kingsley <your@email.com>
 * @description Description of the file
 * @date 2024-09-01
 * @file /src/api/v1/modules/course/controllers
 */

import { NextFunction, Request, RequestHandler, Response } from 'express'
import CourseService from '../services'

const courseService = new CourseService()

class CourseController {
  constructor() {}
  async createCourse(req: Request, res: Response, next: NextFunction) {
    const creationDetails = req.body
    const { userId } = req.params
    const files = req.files

    try {
      const { courseId, error } = await courseService.create({
        userId,
        title: creationDetails.title,
        files,
        subtopics: creationDetails.subtopics,
      })
      if (error) {
        throw error
      }
      res.status(200).json({ courseId: courseId })
    } catch (error) {
      next(error)
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {}
  async editCourse(req: Request, res: Response, next: NextFunction) {}

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await courseService.getAllCourses()
      return res.status(200).json({ courses })
    } catch (err) {
      return next(err)
    }
  }
  async getUserCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId
      const { coursesList, error } = await courseService.getUserCourses(userId)
      if (error) {
        throw error
      } else {
        res.status(200).json({ courses: coursesList })
      }
    } catch (error) {
      next(error)
    }
  }

  getCourseById:RequestHandler = async (req, res, next) =>{
    try {
      const courseId = req.params.courseId
      const course = await courseService.getCourseById(courseId)
      res.status(200).json({
          message: 'Successfully Gotten a Course',
          success: true,
          data: course,
        })
    } catch (error) {
      next(error)
    }
  }
}
export default CourseController

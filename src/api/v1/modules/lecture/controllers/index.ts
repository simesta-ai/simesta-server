import { NextFunction, Request, Response } from 'express'
import LectureService from '../services'

const lectureService = new LectureService()

class LectureController {

  async createLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, lectureId } = req.params
      const { lectureContent, error } =
        await this.getLectureService.createNewLecture(courseId, lectureId)
      if (error) {
        throw error
      } else {
        res.status(200).json(lectureContent)
      }
    } catch (error) {
      next(error)
    }
  }
  async getLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const { lectureId } = req.params
      const { lectureContent, error } = await this.getLectureService.getLecture(
        lectureId
      )
      if (error) {
        throw error
      } else {
        res.status(200).json(lectureContent)
      }
    } catch (error) {
      next(error)
    }
  }
}

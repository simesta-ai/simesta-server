import { NextFunction, Request, Response } from 'express'
import LectureService from '../services'

const lectureService = new LectureService()

class LectureController {

  async createLectureContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, lectureId } = req.params
      const { lectureContent, error } =
        await lectureService.create({courseId, lectureId})
      if (error) {
        throw error
      } else {
        res.status(200).json(lectureContent)
      }
    } catch (error) {
      next(error)
    }
  }
  async getLectureContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { lectureId } = req.params
      const { lectureContent, error } = await lectureService.get(
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

export default LectureController
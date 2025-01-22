import { NextFunction, Request, Response } from 'express'
import LectureService from '../services'
import { RequestWithUser } from '@/types'

const lectureService = new LectureService()

class LectureController {
  async createLectureContent(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, lectureId } = req.params
      const {
        user: { id },
      } = req.user

      const { lectureContent, error } = await lectureService.create({
        courseId,
        lectureId,
        userId: id,
      })
      if (error) {
        throw error
      } else {
        res.status(200).json(lectureContent)
      }
    } catch (error) {
      next(error)
    }
  }
  async getLectureContent(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lectureId } = req.params
      const { lectureContent, error } = await lectureService.get(lectureId)
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

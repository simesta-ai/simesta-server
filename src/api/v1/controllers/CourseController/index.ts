import { NextFunction, Request, Response } from 'express'
import CourseCreationService from './createcourse'
import {
  ServerError,
  ValidateError,
} from '../../../../libs/utils/handlers/error'
import GetCourseService from './getcourse'
import GetTopicService from './gettopic'
import GetLectureService from './getlecture'
import CourseService from '../../services/CourseService'

const courseService = new CourseService()

class CourseController {
  private courseCreationService: CourseCreationService
  private getCourseService: GetCourseService
  private getTopicService: GetTopicService
  private getLectureService: GetLectureService

  constructor() {
    this.courseCreationService = new CourseCreationService()
    this.getCourseService = new GetCourseService()
    this.getTopicService = new GetTopicService()
    this.getLectureService = new GetLectureService()
  }
  async createCourse(req: Request, res: Response, next: NextFunction) {
    const creationDetails = req.body
    const { userId } = req.params
    const files = req.files

    // courseService.createCourse(userId, creationDetails.title, files, creationDetails.subtopics)

    try {
      const { courseId, error } = await this.courseCreationService.createCourse(
        userId,
        creationDetails.title,
        files,
        creationDetails.subtopics
      )
      if (error) {
        throw error
      } else {
        res.status(200).json({ courseId: courseId })
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {}
  async editCourse(req: Request, res: Response, next: NextFunction) {}
  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId

      //   courseService.getCourse(courseId)

      const { course, topics, error } =
        await this.getCourseService.getCourseFromStore(courseId)
      if (error) {
        throw error
      } else {
        return res.status(200).json({ course: course, topics: topics })
      }
    } catch (error) {
      next(error)
    }
  }
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId
      const { coursesList, error } = await this.getCourseService.getAllCourses(
        userId
      )
      if (error) {
        throw error
      } else {
        res.status(200).json({ courses: coursesList })
      }
    } catch (error) {
      next(error)
    }
  }
  async shareCourse(req: Request, res: Response, next: NextFunction) {}
  async createTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const topicId = req.params.topicId
      const { topic, lectures, error } =
        await this.getTopicService.createNewTopic(topicId)
      if (error) {
        throw error
      } else {
        res.status(200).json({ topic, lectures })
      }
    } catch (error) {
      next(error)
    }
  }
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
  async getTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const topicId = req.params.topicId
      const { topic, lectures, error } = await this.getTopicService.getTopic(
        topicId
      )
      if (error) {
        throw error
      } else {
        res.status(200).json({ topic, lectures })
      }
    } catch (error) {
      next(error)
    }
  }
}

export default CourseController

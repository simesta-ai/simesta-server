import { NextFunction, Request, Response } from "express";
import CourseCreationService from "./createcourse";
import { ServerError, ValidateError } from "../../utils/handlers/error";
import GetCourseService from "./getcourse";
import GetTopicService from "./gettopic";
import GetLectureService from "./getlecture";


class CourseController {
  private courseCreationService: CourseCreationService;
  private getCourseService: GetCourseService;
  private getTopicService: GetTopicService;
  private getLectureService: GetLectureService;

  constructor() {
    this.courseCreationService = new CourseCreationService();
    this.getCourseService = new GetCourseService();
    this.getTopicService = new GetTopicService();
    this.getLectureService = new GetLectureService();
  }
  async createCourse(req: Request, res: Response, next: NextFunction) {
    const creationDetails = req.body;
    const { userId } = req.params;
    const files = req.files;
    try {
      let courseId;
      courseId = await this.courseCreationService.createCourse(
        userId,
        creationDetails.title,
        files,
        creationDetails.subtopics
      );
      res.status(200).json({ courseId: courseId });
    } catch (error) {
      next(error);
      
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {}
  async editCourse(req: Request, res: Response, next: NextFunction) {}
  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId;
      const courseDetails = await this.getCourseService.getCourseFromStore(courseId);
      return res.status(200).json(courseDetails);
    } catch (error) {
      next(error)
    }
  }
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const allCourses = await this.getCourseService.getAllCourses(userId);
      res.status(200).json({ courses: allCourses });
    } catch (error) {
      next(error)
    }
  }
  async shareCourse(req: Request, res: Response, next: NextFunction) {}
  async createTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const topicId = req.params.topicId;
      const topicLectures = await this.getTopicService.createNewTopic(topicId);
      res.status(200).json(topicLectures);
    } catch (error) {
      next(error)
    }
  }
  async createLecture(req: Request, res: Response, next: NextFunction){
    try {
      const { courseId, lectureId} = req.params;
      const lectureContent = await this.getLectureService.createNewLecture(courseId, lectureId);
      res.status(200).json(lectureContent);
    } catch (error) {
      next(error);
    }
  }
  async getLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const { lectureId } = req.params;
      const lectureContent = await this.getLectureService.getLecture(lectureId);
      res.status(200).json(lectureContent);
    } catch (error) {
      next(error);
    }
  }
  async getTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const topicId = req.params.topicId;
      const topicLectures = await this.getTopicService.getTopic(topicId);
      res.status(200).json(topicLectures);
    } catch (error) {
      next(error)
    }
  }

}

export default CourseController;

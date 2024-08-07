import { NextFunction, Request, Response } from "express";
import CourseService from "../services/CourseService";
import { ServerError } from "../utils/handlers/error";

class CourseController {
  // Implement methods for course creation, retrieval, etc.
  private courseService;

  constructor() {
    this.courseService = new CourseService();
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    const creationDetails = req.body;
    const { id } = req.params;
    try {
      let courseId;
      if (
        Object.keys(creationDetails).length == 1 &&
        Object.keys(creationDetails)[0] == "courseTitle"
      ) {
        courseId = await this.courseService.createCourseFromTitle(
          creationDetails.courseTitle,
          id
        );
      }
      res.status(200).json({ courseId: courseId });
    } catch (error) {
      throw new ServerError("Problem creating course, wait and retry");
    }
  }
  async deleteCourse(req: Request, res: Response, next: NextFunction) {}
  async editCourse(req: Request, res: Response, next: NextFunction) {}
  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId;
      const courseDetailsWithTopics =
        await this.courseService.getCourseFromStore(courseId);
      res.status(200).json(courseDetailsWithTopics);
    } catch (error) {
      throw new ServerError("Unable to fetch course");
    }
  }
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const allCourses = await this.courseService.getAllCourses(userId);
      res.status(200).json({ courses: allCourses });
    } catch (error) {
      throw new ServerError("Unable to fetch course");
    }
  }
  async shareCourse(req: Request, res: Response, next: NextFunction) {}
  async getLectures(req: Request, res: Response, next: NextFunction) {}
  async getLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const lectureId = req.params.lectureId;
      const lectureContent = await this.courseService.getLecture(lectureId);
      res.status(200).json(lectureContent);
    } catch (error) {
      throw new ServerError("Unable to fetch course");
    }
  }
  async getTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const topicId = req.params.topicId;
      const topicLectures = await this.courseService.getTopic(topicId);
      res.status(200).json(topicLectures);
    } catch (error) {
      throw new ServerError("Unable to fetch course");
    }
  }
  async getTopics(req: Request, res: Response, next: NextFunction) {}
}

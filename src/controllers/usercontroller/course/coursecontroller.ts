import { NextFunction, Request, Response } from "express";
import CourseCreationService from "./createcourse";
import { ServerError } from "../../../utils/handlers/error";
import GetCourseService from "./getcourse";
import GetTopicService from "./gettopic";
import GetLectureService from "./getlecture";

class CourseController {
    private courseCreationService: CourseCreationService;
    private getCourseService: GetCourseService;
    private getTopicService: GetTopicService;
    private getLectureService: GetLectureService

    constructor(){
        this.courseCreationService = new CourseCreationService();
        this.getCourseService = new GetCourseService();
        this.getTopicService = new GetTopicService();
        this.getLectureService = new GetLectureService();
    }
    async createCourse(req: Request, res: Response, next: NextFunction) {
        const creationDetails = req.body;
        const { id } = req.params;
        const topics = creationDetails.topics
        try {
            let courseId;
            // This function is fired if the user includes topics when creating course
            if(topics) {
                courseId = await this.courseCreationService.createCourseFromTitleAndTopics(creationDetails.courseTitle, topics, id)
            } else if (Object.keys(creationDetails).length == 1 && Object.keys(creationDetails)[0] == "courseTitle"){
                courseId = await this.courseCreationService.createCourseFromTitle(creationDetails.courseTitle, id)
            }
            res.status(200).json({ courseId: courseId})
        } catch (error) {
            console.log(error)
            throw new ServerError("Problem creating course, wait and retry")
        }
    }
    async deleteCourse(req: Request, res: Response, next: NextFunction) {

    }
    async editCourse(req: Request, res: Response, next: NextFunction) {

    }
    async getCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;
            const courseDetailsWithTopics = await this.getCourseService.getCourseFromStore(courseId)
            res.status(200).json(courseDetailsWithTopics)
        } catch (error) {
            throw new ServerError("Unable to fetch course")
        }
    }
    async getAllCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const allCourses = await this.getCourseService.getAllCourses(userId)
            res.status(200).json({ courses: allCourses})
        } catch (error) {
            throw new ServerError("Unable to fetch course")
        }
    }
    async shareCourse(req: Request, res: Response, next: NextFunction) {

    }
    async getLectures(req: Request, res: Response, next: NextFunction) {

    }
    async getLecture(req: Request, res: Response, next: NextFunction) {
        try {
            const lectureId = req.params.lectureId;
            const lectureContent = await this.getLectureService.getLecture(lectureId)
            res.status(200).json(lectureContent)
        } catch (error) {
            throw new ServerError("Unable to fetch course")
        }
    }
    async getTopic(req: Request, res: Response, next: NextFunction) {
        try {
            const topicId = req.params.topicId;
            const topicLectures = await this.getTopicService.getTopic(topicId)
            res.status(200).json(topicLectures)
        } catch (error) {
            throw new ServerError("Unable to fetch course")
        }
    }
    async getTopics(req: Request, res: Response, next: NextFunction) {

    }
}

export default CourseController
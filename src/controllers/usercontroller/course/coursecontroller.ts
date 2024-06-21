import { NextFunction, Request, Response } from "express";
import CourseCreationService from "./createcourse";
import { ServerError } from "../../../utils/handlers/error";

class CourseController {
    private courseCreationService: CourseCreationService;

    constructor(){
        this.courseCreationService = new CourseCreationService();
    }
    async createCourse(req: Request, res: Response, next: NextFunction) {
        const creationDetails = req.body;
        const { email } = req.params;
        try {
            let courseId;
            if(Object.keys(creationDetails).length == 1 && Object.keys(creationDetails)[0] == "courseTitle"){
                courseId = await this.courseCreationService.createCourseFromTitle(creationDetails.courseTitle, email)
            }
            res.status(200).json({ courseId: courseId})
        } catch (error) {
            throw new ServerError("Problem creating course, wait and retry")
        }
    }
    async deleteCourse(req: Request, res: Response, next: NextFunction) {

    }
    async editCourse(req: Request, res: Response, next: NextFunction) {

    }
    async getCourse(req: Request, res: Response, next: NextFunction) {

    }
    async getAllCourses(req: Request, res: Response, next: NextFunction) {

    }
    async shareCourse(req: Request, res: Response, next: NextFunction) {

    }
    async getLectures(req: Request, res: Response, next: NextFunction) {

    }
    async getLecture(req: Request, res: Response, next: NextFunction) {

    }
    async getTopic(req: Request, res: Response, next: NextFunction) {

    }
    async getTopics(req: Request, res: Response, next: NextFunction) {

    }
}

export default CourseController
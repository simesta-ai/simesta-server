import { NextFunction, Request, Response } from "express";

class CourseCreationService {
    async createCourseFromTitle(courseTitle: string, userEmail: string): Promise<string>{

        return courseTitle
    }
    createCourseFromTitleAndFile(){

    }
    createCourseFromTitleAndSubTopics(){

    }
}

export default CourseCreationService
import User from "../../../models/user.model";
import Course from "../../../models/course.model";
import CourseWithFile from "../../../models/course-with-file.model"
import AIGenerator from "../../../utils/services/aigenerator"
import { AuthError } from "../../../utils/handlers/error";
import { FileService } from "../../../utils/services/parseFile";
import fs from "fs";

class CourseCreationService {
    private AIGenerator: AIGenerator;
    private FileService: FileService


    constructor(){
        this.AIGenerator = new AIGenerator();
        this.FileService = new FileService();
    }
    async createCourseFromTitle(courseTitle: string, userId: string): Promise<string>{
        
        const courseDescription = await this.AIGenerator.generateCourseDescription(courseTitle)
        const courseCategory = await this.AIGenerator.generateCoursecategory(courseTitle)
        const courseImage = await this.AIGenerator.generateCourseImage(courseTitle)
        const user = await User.findById(userId)
        if(!user){
            throw new AuthError("User not found")
        } else {
            const newCourse = new Course({
                title: courseTitle,
                description: courseDescription,
                category: courseCategory,
                image: courseImage,
                user: user!._id,
              })
              await newCourse.save()
              return newCourse._id
        } 
    }

    async createCourseFromTitleAndFile(courseTitle: string, userId: string, files: any){
        const filePaths = files.map((file: any) => file.path);
        const fileData = await Promise.all(
            filePaths.map(async (filePath: string) => {
              const data = await this.FileService.parseFile(filePath);
              return data;
            })
          );

        filePaths.forEach((filePath: string) => {
            fs.unlinkSync(filePath);});

        const courseDescription = await this.AIGenerator.generateCourseDescription(courseTitle)
        const courseCategory = await this.AIGenerator.generateCoursecategory(courseTitle)
        const courseImage = await this.AIGenerator.generateCourseImage(courseTitle)

        const user = await User.findById(userId)
        if(!user){
            throw new AuthError("User not found")
        } else {
            const newCourse = new CourseWithFile({
                title: courseTitle,
                description: courseDescription,
                category: courseCategory,
                image: courseImage,
                user: user!._id,
                courseFiles: fileData
              })
              await newCourse.save()
              return newCourse._id
        } 

    }
    createCourseFromTitleAndSubTopics(){

    }
}

export default CourseCreationService
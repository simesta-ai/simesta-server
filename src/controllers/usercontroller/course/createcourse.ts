import User from "../../../models/user.model";
import Course from "../../../models/course.model";
import AIGenerator from "../../../utils/services/aigenerator"
import { AuthError } from "../../../utils/handlers/error";

class CourseCreationService {
    private AIGenerator: AIGenerator;

    constructor(){
        this.AIGenerator = new AIGenerator();
    }
    async createCourseFromTitle(courseTitle: string, userId: string): Promise<string>{
        
        const courseDescription = await this.AIGenerator.generateCourseDescription(courseTitle)
        const courseCategory = await this.AIGenerator.generateCoursecategory(courseTitle)
        const user = await User.findById(userId)
        if(!user){
            throw new AuthError("User not found")
        } else {
            const newCourse = new Course({
                title: courseTitle,
                description: courseDescription,
                category: courseCategory,
                user: user!._id,
              })
              await newCourse.save()
              return newCourse._id
        } 
    }
    createCourseFromTitleAndFile(){

    }
    createCourseFromTitleAndSubTopics(){

    }
}

export default CourseCreationService
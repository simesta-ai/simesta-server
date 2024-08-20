import User from "../../../models/user.model";
import Course from "../../../models/course.model";
import Topic from "../../../models/topic.model";
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
    createCourseFromTitleAndFile(){

    }
    // Id for testing endpoints: 66ba52f704928c27f76d5e7f
    async createCourseFromTitleAndTopics(courseTitle: string, topics: any[], userId: string){
        const courseDescription = await this.AIGenerator.generateCourseDescription(courseTitle)
        const courseCategory = await this.AIGenerator.generateCoursecategory(courseTitle)
        // const courseImage = await this.AIGenerator.generateCourseImage(courseTitle)
        const user = await User.findById(userId)
        if(!user) {
            throw new AuthError("User not found")
        } else {
            const newCourse = new Course({
                title: courseTitle,
                description: courseDescription,
                category: courseCategory,
                // image: courseImage,
                user: user!._id,
            })
            await newCourse.save()

            const courseTopics = await this.AIGenerator.generateCourseTopics(courseTitle, topics)
            for (const topic of courseTopics) {
                const topicPosition = courseTopics.indexOf(topic) + 1;
                const newTopic: any = new Topic({
                  title: topic,
                  position: topicPosition,
                  course: newCourse._id,
                  inProgress: topicPosition === 1 ? true : false
                })
                
                await newTopic.save();
            }

            return newCourse._id
        }

    }
}

export default CourseCreationService
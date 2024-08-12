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

            // Only working with titles now, will find a way to implement subtopics later
            const topicTitles = topics.map((topic) => (topic.title))
            const topicList = await this.AIGenerator.generateCourseTopics(courseTitle, topicTitles)
            for (const topic of topicList) {
                const topicPosition = topicList.indexOf(topic) + 1;
                const newTopic: any = new Topic({
                  title: topic,
                  position: topicPosition,
                  course: newCourse._id,
                  inProgress: topicPosition === 1 ? true : false
                })
                
                await newTopic.save();

                newCourse.topics.push(newTopic)
            }

            await newCourse.save()
            return newCourse._id
        }

    }
}

export default CourseCreationService
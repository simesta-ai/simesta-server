import Course from "../../../models/course.model";
import Topic from "../../../models/topic.model"
import Lecture from "../../../models/lecture.model"
import AIGenerator from "../../../utils/services/aigenerator";
import { ServerError } from "../../../utils/handlers/error";

class GetTopicService {

    private AIGenerator: AIGenerator;

    constructor() {
        this.AIGenerator = new AIGenerator();
    } 
    async getTopic(topicId: string) {
        try {
            const originalTopic: any = await Topic.findById(topicId)
            const topicLectures = [];
            const existingLectures = await Lecture.find({ topic: topicId })

            // If the topic has lectures already return them
            if(existingLectures.length > 0){
                for(const lecture of existingLectures){
                    topicLectures.push({ id: lecture._id, title: lecture.title, position: lecture.position })
                }
            
            // if the topic does not have existing lectures, create new ones 
            }else{
                
                const originalCourse: any = await Course.findById(originalTopic.course)
                const newLectures = await this.AIGenerator.generateLectures(originalCourse.title, originalTopic.title)
                for(const lecture of newLectures){
                    const lectureNumber = newLectures.indexOf(lecture) + 1
                    const newLecture = await new Lecture ({
                        title: lecture,
                        lectureText: "",
                        videos: [""],
                        position: lectureNumber,
                        topic: topicId
                    }).save()
                    topicLectures.push({ id: newLecture._id, title: newLecture.title, position: newLecture.position })
                }
            }
            return { topic: originalTopic.title,  lectures: topicLectures }
        } catch (error) {
            throw new ServerError("Could not fetch lectures")
        }
    }
}

export default GetTopicService
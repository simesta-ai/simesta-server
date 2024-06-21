import Course from "../../../models/course.model";
import Topic from "../../../models/topic.model";
import { ServerError } from "../../../utils/handlers/error";
import AIGenerator from "../../../utils/services/aigenerator";

class GetCourseService {
  private AIGenerator: AIGenerator;

  constructor() {
    this.AIGenerator = new AIGenerator();
  }
  async getCourseFromStore(courseId: string) {
    try {
      const topicsInfo = [];
      let courseInfo;
      const course = await Course.findById(courseId);
      if (course) {
        courseInfo = {
          id: course._id,
          title: course.title,
          description: course.description,
        };
        const topics: any = await Topic.find({ course: courseId });

        // Return Topics if the course has topics already
        if (topics.length > 0) {
          for (const topic of topics) {
            topicsInfo.push({
              id: topic._id,
              title: topic.title,
              position: topic.position,
            });
          }
          // Create new topics if the course does not have any
        } else {
          const newTopics = await this.AIGenerator.generateTopics(course.title);
          for (const topic of newTopics) {
            const topicPosition = newTopics.indexOf(topic) + 1;
            const newTopic: any = await new Topic({
              title: topic,
              position: topicPosition,
              course: courseId,
            }).save();
            topicsInfo.push({
              id: newTopic._id,
              title: newTopic.title,
              position: newTopic.position,
            });
          }
        }
        return { course: courseInfo, topics: topicsInfo };
      } else {
        throw new Error("Course not found");
      }
    } catch (error) {
      throw new ServerError("Could not fetch course");
    }
  }
}

export default GetCourseService;

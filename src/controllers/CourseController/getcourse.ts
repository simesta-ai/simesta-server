import User from "../../models/user.model";
import Course from "../../models/course.model";
import Topic from "../../models/topic.model";
import { AuthError, ServerError } from "../../utils/handlers/error";
import AIGenerator from "../../utils/services/aigenerator";
import { nextTick } from "process";
import logger from "../../utils/logger";

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
          image: course.image,
        };
        const topics: any = await Topic.find({ course: courseId });

        // Return Topics 
        if (topics.length > 0) {
          for (const topic of topics) {
            topicsInfo.push({
              id: topic._id,
              title: topic.title,
              position: topic.position,
              completed: topic.completed,
              inProgress: topic.inProgress,
            });
          }
          
        } else {
          throw new ServerError("Unable to fetch course topics")
        }
        return { course: courseInfo, topics: topicsInfo };
      } else {
        throw new ServerError("Course not found");
      }
    } catch (error) {
      logger.error(error)
    }
  }


  async getAllCourses(userId: string) {
    try {
      const coursesList = [];
      const user = await User.findById(userId);
      if (user) {
        const courses = await Course.find({ user: userId });
        if(!courses){
          throw new ServerError("User does not have any course created yet")
        }
        for (const course of courses) {
          const topics: any = await Topic.find({ course: course._id });
          const numberOfTopics = topics.length;
          let i = 0;
          for (const topic of topics) {
            if (topic.completed) {
              i++;
            }
          }
          coursesList.push({
            id: course._id,
            title: course.title,
            image: course.image,
            progress: (i / numberOfTopics) * 100,
            topicsCompleted: `${i} / ${numberOfTopics}`,
          });
        }
        if(!coursesList){
          throw new ServerError("Error fetching courses")
        }
        return coursesList;
      } else {
        throw new AuthError("Couldn't fetch courses, user is invalid")
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export default GetCourseService;

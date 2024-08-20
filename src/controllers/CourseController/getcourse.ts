import User from "../../models/user.model";
import Course from "../../models/course.model";
import Topic from "../../models/topic.model";
import { AuthError, CustomError, ServerError } from "../../utils/handlers/error";
import AIGenerator from "../../utils/services/aigenerator";
import { nextTick } from "process";
import logger from "../../utils/logger";


interface ICourse {
  id: string;
  title: string;
  image: string;
  progress: number;
  topicsCompleted: string

}

class GetCourseService {
  private AIGenerator: AIGenerator;

  constructor() {
    this.AIGenerator = new AIGenerator();
  }
  async getCourseFromStore(courseId: string) {
    let error: CustomError | null = null;
    let courseInfo;
    const topicsInfo = [];
    try {
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
          error = new ServerError("Unable to fetch course topics")
        }
        
      } else {
        error = new ServerError("This course does not exist.");
      }
    } catch (error) {
      logger.error(error)
    }
    return { course: courseInfo, topics: topicsInfo, error: error };
  }


  async getAllCourses(userId: string): Promise<{ coursesList: Array<ICourse>, error: CustomError | null}> {
    let error: CustomError | null = null;
    const coursesList: Array<ICourse> = [];
    try {
      
      const user = await User.findById(userId);
      if (user) {
        const courses = await Course.find({ user: userId });
        if(courses.length < 1){
          error = new ServerError("User does not have any course created yet")
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
        if(coursesList.length < 1 && courses.length > 0){
          error = new ServerError("Error retrieving courses, please retry")
        }
      } else {
        error = new AuthError("Couldn't fetch courses, user is invalid")
      }
    } catch (error) {
      logger.error(error)
    }
    return {coursesList , error};
  }
}

export default GetCourseService;

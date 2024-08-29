import CourseModel from '../../models/course.model';
import TopicModel from '../../models/topic.model';
import logger from '../../packages/logger';
import { CustomError, ServerError } from '../../utils/handlers/error';

const getCourse = async (courseId: string) => {
    let error: CustomError | null = null;
    let courseInfo;
    const topicsInfo = [];
    try {
      const course = await CourseModel.findById(courseId);
      if (course) {
        courseInfo = {
          id: course._id,
          title: course.title,
          description: course.description,
          image: course.image,
        };
        const topics: any = await TopicModel.find({ course: courseId });

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

  export default getCourse

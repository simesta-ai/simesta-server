import CourseModel from '../../models/course.model';
import TopicModel from '../../models/topic.model';
import UserModel from '../../models/user.model';
import logger from '../../packages/logger';
import { ICourse } from '../../types';
import { AuthError, CustomError, ServerError } from '../../utils/handlers/error';

const  getAllCourses = async (userId: string): Promise<{ coursesList: Array<ICourse>, error: CustomError | null}> => {
    let error: CustomError | null = null;
    const coursesList: Array<ICourse> = [];
    try {

      const user = await UserModel.findById(userId);
      if (user) {
        const courses = await CourseModel.find({ user: userId });
        if(courses.length < 1){
          error = new ServerError("User does not have any course created yet")
        }
        for (const course of courses) {
          const topics: any = await TopicModel.find({ course: course._id });
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

  export default getAllCourses

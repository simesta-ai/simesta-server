import User from "../../models/user.model";
import Course from "../../models/course.model";
import CourseWithFile from "../../models/courseWithFile.model";
import Topic from "../../models/topic.model";
import { ServerError } from "../../utils/handlers/error";
import AIGenerator from "../../utils/services/aigenerator";

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

        // Return Topics if the course has topics already
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
          // Create new topics if the course does not have any
        } else {
          const newTopics = await this.AIGenerator.generateTopics(course.title);
          for (const topic of newTopics) {
            const topicPosition = newTopics.indexOf(topic) + 1;
            const newTopic: any = await new Topic({
              title: topic,
              position: topicPosition,
              course: courseId,
              inProgress: topicPosition === 1 ? true : false,
            }).save();
            topicsInfo.push({
              id: newTopic._id,
              title: newTopic.title,
              position: newTopic.position,
              completed: newTopic.completed,
              inProgress: newTopic.inProgress,
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

  async getCourseWithFile(courseId: string, courseFiles: string[]) {
    try {
      const topicsInfo = [];
      let courseInfo;
      const course = await CourseWithFile.findById(courseId);
      if (course) {
        courseInfo = {
          id: course._id,
          title: course.title,
          description: course.description,
          image: course.image,
        };
        const topics: any = await Topic.find({ course: courseId });

        // Return Topics if the course has topics already
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
          // Create new topics if the course does not have any
        } else {
          const newTopics = await this.AIGenerator.generateTopicsWithFile(
            course.title,
            courseFiles
          );
          for (const topic of newTopics) {
            const topicPosition = newTopics.indexOf(topic) + 1;
            const newTopic: any = await new Topic({
              title: topic,
              position: topicPosition,
              course: courseId,
              inProgress: topicPosition === 1 ? true : false,
            }).save();
            topicsInfo.push({
              id: newTopic._id,
              title: newTopic.title,
              position: newTopic.position,
              completed: newTopic.completed,
              inProgress: newTopic.inProgress,
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

  async getAllCourses(userId: string) {
    try {
      const coursesList = [];
      const user = await User.findById(userId);
      if (user) {
        const courses = await Course.find({ user: userId });
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
        return coursesList;
      }
    } catch (error) {
      throw new ServerError("Error fetching courses");
    }
  }
}

export default GetCourseService;

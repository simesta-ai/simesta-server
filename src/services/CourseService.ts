import CourseModel from "../models/course.model";
import LectureModel from "../models/lecture.model";
import TopicModel from "../models/topic.model";
import UserModel from "../models/user.model";
import { AuthError, ServerError } from "../utils/handlers/error";
import AIGenerator from "../utils/services/aigenerator";
import VideoGenerator from "../utils/services/videogenerator";

class CourseService {
  private AIGenerator: AIGenerator;
  private VideoGenerator: VideoGenerator;

  constructor() {
    this.AIGenerator = new AIGenerator();
    this.VideoGenerator = new VideoGenerator();
  }
  async createCourseFromTitle(
    courseTitle: string,
    userId: string
  ): Promise<string> {
    const courseDescription = await this.AIGenerator.generateCourseDescription(
      courseTitle
    );
    const courseCategory = await this.AIGenerator.generateCoursecategory(
      courseTitle
    );
    const courseImage = await this.AIGenerator.generateCourseImage(courseTitle);
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AuthError("User not found");
    } else {
      const newCourse = new CourseModel({
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        image: courseImage,
        user: user!._id,
      });
      await newCourse.save();
      return newCourse._id;
    }
  }
  createCourseFromTitleAndFile() {}
  createCourseFromTitleAndSubTopics() {}

  async getCourseFromStore(courseId: string) {
    try {
      const topicsInfo = [];
      let courseInfo;
      const course = await CourseModel.findById(courseId);
      if (course) {
        courseInfo = {
          id: course._id,
          title: course.title,
          description: course.description,
          image: course.image,
          progress: 0,
        };
        const topics: any = await TopicModel.find({ course: courseId });

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
            const newTopic: any = await new TopicModel({
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
        const numberOfTopics = topics.length;
        let i = 0;
        for (const topic of topics) {
          if (topic.completed) {
            i++;
          }
        }
        courseInfo.progress = (i / numberOfTopics) * 100;
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
      const user = await UserModel.findById(userId);
      if (user) {
        const courses = await CourseModel.find({ user: userId });
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
            description: course.description,
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

  async getLecture(lectureId: string) {
    try {
      const lectureContent = {
        lectureText: "",
        videos: [""],
      };
      const lecture = await LectureModel.findById(lectureId);
      // Check if the lecture has text and video content
      if (lecture) {
        if (lecture.lectureText.length > 0) {
          lectureContent.lectureText = lecture.lectureText;
        } else {
          // Generate AI content if no text content is available
          const generatedLecture = await this.AIGenerator.generateLectureText(
            lecture.title
          );
          await LectureModel.findByIdAndUpdate(lectureId, {
            lectureText: generatedLecture,
          });
          lectureContent.lectureText = generatedLecture;
        }

        if (lecture.videos.length > 0 && lecture.videos[0].length > 0) {
          lectureContent.videos = lecture.videos;
        } else {
          // Generate video content if no video content is available
          const generatedVideos = await this.VideoGenerator.generateVideos(
            lecture.title
          );
          const filteredVideos = generatedVideos.filter((videoId) => videoId);
          await LectureModel.findByIdAndUpdate(lectureId, {
            videos: filteredVideos,
          });
          lectureContent.videos = filteredVideos;
        }
      } else {
        throw new ServerError("Lecture not found");
      }
      return lectureContent;
    } catch (error) {
      throw new ServerError("Could not get lecture content");
    }
  }
  async getTopic(topicId: string) {
    try {
      const originalTopic: any = await TopicModel.findById(topicId);
      const topicLectures = [];
      const existingLectures = await LectureModel.find({ topic: topicId });

      // If the topic has lectures already return them
      if (existingLectures.length > 0) {
        for (const lecture of existingLectures) {
          topicLectures.push({
            id: lecture._id,
            title: lecture.title,
            position: lecture.position,
          });
        }

        // if the topic does not have existing lectures, create new ones
      } else {
        const originalCourse: any = await CourseModel.findById(
          originalTopic.course
        );
        const newLectures = await this.AIGenerator.generateLectures(
          originalCourse.title,
          originalTopic.title
        );
        for (const lecture of newLectures) {
          const lectureNumber = newLectures.indexOf(lecture) + 1;
          const newLecture = await new LectureModel({
            title: lecture,
            lectureText: "",
            videos: [""],
            position: lectureNumber,
            topic: topicId,
          }).save();
          topicLectures.push({
            id: newLecture._id,
            title: newLecture.title,
            position: newLecture.position,
          });
        }
      }
      return { topic: originalTopic.title, lectures: topicLectures };
    } catch (error) {
      throw new ServerError("Could not fetch lectures");
    }
  }
}

export default CourseService;

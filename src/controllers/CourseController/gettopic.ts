import Course from "../../models/course.model";
import Topic from "../../models/topic.model";
import Lecture from "../../models/lecture.model";
import AIGenerator from "../../utils/services/aigenerator";
import { ServerError } from "../../utils/handlers/error";
import { string } from "joi";
import logger from "../../utils/logger";

interface ITopicLecture {
  id: string;
  title: string;
  position: number
}

class GetTopicService {
  private AIGenerator: AIGenerator;

  constructor() {
    this.AIGenerator = new AIGenerator();
  }
  private async createLectures(topicId: string, courseTitle: string, topicTitle: string, courseFiles?: string){
    const topicLectures: Array<ITopicLecture> = [];
    let newLectures: string[] = [];
    if(courseFiles && courseFiles.length > 10){
      newLectures = await this.AIGenerator.generateLecturesWithFiles(
        courseTitle,
        topicTitle,
        courseFiles
      )
    } else {
      newLectures = await this.AIGenerator.generateLectures(
        courseTitle,
        topicTitle
      );
    }
    for (const lecture of newLectures) {
      const lectureNumber = newLectures.indexOf(lecture) + 1;
      const newLecture = await new Lecture({
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
    return topicLectures
  }
  async createNewTopic(topicId: string) {
    try {
      const originalTopic: any = await Topic.findById(topicId);

      const originalCourse: any = await Course.findById(originalTopic.course);
      const createdLectures = await this.createLectures(topicId, originalCourse.title, originalTopic.title, originalCourse.courseFiles.join(" "))
      if(!createdLectures) throw new ServerError("Unable to create topic content, could not generate lectures")
      return { topic: originalTopic.title, lectures: createdLectures };
    } catch (error) {
      logger.error(error);
    }
  }
  async getTopic(topicId: string) {
    try {
      const originalTopic: any = await Topic.findById(topicId);
      const topicLectures = [];
      const existingLectures = await Lecture.find({ topic: topicId });

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
        throw new ServerError("Unable to fetch topic content, no lectures exist")
      }
      return { topic: originalTopic.title, lectures: topicLectures };
    } catch (error) {
      logger.error(error)
    }
  }
}

export default GetTopicService;

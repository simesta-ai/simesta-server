import AIGenerator from "../../utils/services/aigenerator";
import Lecture from "../../models/lecture.model";
import VideoGenerator from "../../utils/services/videogenerator";
import { ServerError } from "../../utils/handlers/error";
import Course from "../../models/course.model";
import logger from "../../utils/logger";

class GetLectureService {
  private AIGenerator: AIGenerator;
  private VideoGenerator: VideoGenerator;

  constructor() {
    this.AIGenerator = new AIGenerator();
    this.VideoGenerator = new VideoGenerator();
  }

  private async generateLectureText(lectureTitle: string, courseFiles?: string){
    let lectureText = ""
    if(courseFiles && courseFiles.length > 10){
      lectureText = await this.AIGenerator.generateLectureTextWithFiles(
        lectureTitle,
        courseFiles
      );
    } else {
      lectureText = await this.AIGenerator.generateLectureText(
        lectureTitle
      );
    }
    return lectureText;
  }

  async createNewLecture(courseId: string, lectureId: string){
    try {
      const lectureContent = {
        lectureText: "",
        videos: [""],
      };
      const lecture = await Lecture.findById(lectureId);
      const course = await Course.findById(courseId)
      // Check if the lecture has text and video content
      if (lecture && course) {
          // Generate AI content 
          const generatedLecture = await this.generateLectureText(
            lecture.title,
            course.courseFiles.join(" ")
          );
          await Lecture.findByIdAndUpdate(lectureId, {
            lectureText: generatedLecture,
          });
          lectureContent.lectureText = generatedLecture;
        
          // Generate video content 
          const generatedVideos = await this.VideoGenerator.generateVideos(
            lecture.title
          );
          const filteredVideos = generatedVideos.filter((videoId) => videoId);
          await Lecture.findByIdAndUpdate(lectureId, {
            videos: filteredVideos,
          });
          lectureContent.videos = filteredVideos;
        
      } else {
        throw new ServerError("Lecture not found");
      }
      return lectureContent;
    } catch (error) {
      logger.error(error)
    }
  }

  async getLecture(lectureId: string) {
    try {
      const lectureContent = {
        lectureText: "",
        videos: [""],
      };
      const lecture = await Lecture.findById(lectureId);
      // Check if the lecture has text and video content
      if (lecture) {
        if (lecture.lectureText.length > 0) {
          lectureContent.lectureText = lecture.lectureText;
        } else {
          throw new ServerError("Lecture content does not exist")
        }

        if (lecture.videos.length > 0 && lecture.videos[0].length > 0) {
          lectureContent.videos = lecture.videos;
        } else {
          throw new ServerError("Lecture videos do no exist")
        }
      } else {
        throw new ServerError("Lecture not found");
      }
      return lectureContent;
    } catch (error) {
      logger.error(error);
    }
  }
}

export default GetLectureService;

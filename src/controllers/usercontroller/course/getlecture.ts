import AIGenerator from "../../../utils/services/aigenerator"
import Lecture from "../../../models/lecture.model"
import VideoGenerator from "../../../utils/services/videogenerator"
import { ServerError } from "../../../utils/handlers/error";

class GetLectureService {

    private AIGenerator: AIGenerator;
    private VideoGenerator: VideoGenerator;

    constructor() {
        this.AIGenerator = new AIGenerator();
        this.VideoGenerator = new VideoGenerator();
    }

    async getLecture(lectureId: string){
        try {
            const lectureContent = {
                lectureText: "",
                videos: [""]
            };
            const lecture = await Lecture.findById(lectureId);
            // Check if the lecture has text and video content
            if(lecture){
                if(lecture.lectureText.length > 0){
                    lectureContent.lectureText = lecture.lectureText;
                } else {
                    // Generate AI content if no text content is available
                    const generatedLecture = await this.AIGenerator.generateLectureText(lecture.title);
                    await Lecture.findByIdAndUpdate(lectureId, { lectureText: generatedLecture });
                    lectureContent.lectureText = generatedLecture;
                }
                if(lecture.videos.length > 0 && lecture.videos[0].length > 0){
                    lectureContent.videos = lecture.videos;
                }else {
                    // Generate video content if no video content is available
                    const generatedVideos = await this.VideoGenerator.generateVideos(lecture.title)
                    const filteredVideos = generatedVideos.filter((videoId) => videoId !== null);
                    await Lecture.findByIdAndUpdate(lectureId, { videos: filteredVideos });
                    lectureContent.videos = filteredVideos;
                    
                }
            }else {
                throw new ServerError("Lecture not found");
            }
            return lectureContent;
        } catch (error) {
            throw new ServerError("Could not get lecture content")
        }
    }
}

export default GetLectureService
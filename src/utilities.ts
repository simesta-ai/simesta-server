// import generators from "./generators/generate"
import { google } from "googleapis";
import generators from "./generators/generate";
import dotenv from "dotenv";


dotenv.config();
const API = process.env.GOOGLE_CLOUD_API_KEY as string
const youtube = google.youtube({
    version: "v3",
    auth: API,
});


export const createLecture = async (lectureTitle: string) => {

    const lecture = {name: lectureTitle, videos: [""], lectureText: ""}
  
    // generate videos
    // const generateVideos = async (lecture: string) => {
    //     const videos = await youtube.search.list({
    //         part: ["snippet"],
    //         q: lecture,
    //         maxResults: 10
    //     })
    //  return videos
    // }
    // await generateVideos(lectureTitle).then((response) => {
    //     const videoIds: string[] = []
    //     if(response.data.items){
    //       response.data.items.forEach((video) => {
    //         const id = video.id!.videoId as string
    //         videoIds.push(id)
    //       })
    //     }
    //     lecture.videos = videoIds
    // })

    // generate Lecture Text
    const lectureText = await generators.generateLectureText(lectureTitle)
    lecture.lectureText = lectureText

    return lecture
     
};



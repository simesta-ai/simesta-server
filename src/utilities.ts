// import generators from "./generators/generate"
import { google } from "googleapis";
import dotenv from "dotenv";


dotenv.config();
const API = process.env.GOOGLE_CLOUD_API_KEY as string


export const createLecture = async (lectureTitle: string) => {
  
    const youtube = google.youtube({
        version: "v3",
        auth: API,
    });
    const videos = await youtube.search.list({
        part: ["snippet"],
        q: lectureTitle,
        maxResults: 10
    })


 return videos
     
};



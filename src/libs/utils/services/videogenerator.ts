import { google, youtube_v3 } from "googleapis";
import { ServerError } from "../handlers/error";
import dotenv from "dotenv";

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config();

class VideoGenerator {
    private APIKEY: string;
    private YoutubeAPI: youtube_v3.Youtube

    constructor(){
        this.APIKEY = process.env.GOOGLE_CLOUD_API_KEY as string
        this.YoutubeAPI = google.youtube({
            version: "v3",
            auth: this.APIKEY,
        });
    }

    async generateVideos(lecture: string): Promise<Array<string>> {
        const videoIds: string[] = []
        try {
            const videos = await this.YoutubeAPI.search.list({
                part: ["snippet"],
                q: lecture,
                maxResults: 10
            })
            if(videos.data.items){
                videos.data.items.forEach((video) => {
                  const id = video.id!.videoId as string
                  videoIds.push(id)
                })
              }
            return videoIds
        } catch (error: any) {
            const message = error.message;
            throw new ServerError(message);
        }

    }
}

export default VideoGenerator
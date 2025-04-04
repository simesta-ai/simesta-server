import {
  ConfigOptions,
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";
import streamifier from "streamifier";
import { ServerError } from "../handlers/error";
import dotenv from "dotenv";
import { string } from "joi";

dotenv.config();

class CloudinaryService {
  private cloudinary: ConfigOptions;

  constructor() {
    this.cloudinary = cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImageBufferToCloud(buffer: Buffer): Promise<string | undefined> {
    // let imageUrl: string | undefined = "";
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    try {
      const response = await new Promise((resolve, reject) => {
        let cloudStreamUpload = cloudinary.uploader.upload_stream(
          {
            folder: "course-images",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result?.secure_url);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(cloudStreamUpload);
      });
      if(typeof response === "string"){
        return response
      }
      return ""
    } catch (error) {
      throw new ServerError("Could not save image to the cloud");
    }
}
}

export default CloudinaryService;

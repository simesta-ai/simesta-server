import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";
import CloudinaryService from "./cloudinary";
import { ServerError } from "../handlers/error";
import dotenv from "dotenv";
import Converter from "../handlers/converter";
import { resolve } from "path";

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config();

class AIGenerator {
  private readonly genAI: GoogleGenerativeAI;
  private readonly textModel: GenerativeModel;
  private readonly clarifaiDalleImageModel: typeof ClarifaiStub;
  private readonly clarifaiMetadata;
  private converter: Converter;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_CLOUD_API_KEY as string
    );
    this.textModel = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.clarifaiDalleImageModel = ClarifaiStub.grpc();
    this.clarifaiMetadata = new grpc.Metadata();
    this.converter = new Converter();
    this.cloudinaryService = new CloudinaryService();
  }

  private async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.textModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return text;
    } catch (error: any) {
      const message = error.message;
      throw new ServerError(message);
    }
  }

  private clarifaiImageModelConfig(prompt: string) {
    return {
      user_app_id: {
        user_id: process.env.USER_ID,
        app_id: process.env.APP_ID,
      },
      model_id: process.env.MODEL_ID,
      version_id: process.env.MODEL_VERSION_ID,
      inputs: [
        {
          data: {
            text: {
              raw: prompt,
            },
          },
        },
      ],
    };
  }



  // Generate Course Category
  async generateCoursecategory(courseTitle: string): Promise<string> {
    const prompt = `generate a 1 word category for a ${courseTitle} course`;
    const categoryText = await this.generateText(prompt);
    return categoryText;
  }

  //  Generate Course Description
  async generateCourseDescription(courseTitle: string): Promise<string> {
    const prompt = `generate a 50 word description for a ${courseTitle} course that describes what would be learnt and areas that would be covered`;
    const courseDescription = await this.generateText(prompt);
    return courseDescription;
  }

  //  Generate Course Topics
  async generateTopics(courseTitle: string): Promise<Array<string>> {
    const prompt = `generate a list of topics(in text only, numbered form without description and removing the subtopics) needed to completely learn ${courseTitle} course`;
    const topicsText = await this.generateText(prompt);

    // Convert text list to array of topics
    const topicList = this.converter.textToArray(topicsText);
    return topicList;
  }

  // Generate Topic Lectures
  async generateLectures(
    courseTitle: string,
    topicTitle: string
  ): Promise<string[]> {
    const prompt = `generate a list of lectures only(in text only, numbered form without description and removing the sub lectures) needed to completely learn ${topicTitle} topic in ${courseTitle} course`;
    const lecturesText = await this.generateText(prompt);

    // Convert text list to array of lectures
    const lectureList = this.converter.textToArray(lecturesText);
    return lectureList;
  }

  //   Generate Lecture text
  async generateLectureText(lectureTitle: string): Promise<string> {
    const prompt = `generate a comprehensive but well explanatory lecture in form of paragraphed texts with necessary bullet points and formatted texts teaching ${lectureTitle}`;
    const lectureText = await this.generateText(prompt);
    return lectureText;
  }

  //  Generate course Image
  async generateCourseImage(courseTitle: string): Promise<string> {
    try {
      const prompt = `generate an graphical illustration that represents the concept of ${courseTitle}`;
      this.clarifaiMetadata.set("authorization", "Key " + process.env.PAT);
      const imageResponse = await new Promise((resolve, reject) => {
        this.clarifaiDalleImageModel.PostModelOutputs(
          this.clarifaiImageModelConfig(prompt),
          this.clarifaiMetadata,
          async (err: any, response: any) => {
            if (err) {
              reject(err);
            }
            if (response.status.code !== 10000) {
              reject(err)
            }
            const imageBuffer = response.outputs[0].data.image.base64;
            const secureImageUrl = await this.cloudinaryService.uploadImageBufferToCloud(imageBuffer);
            resolve(secureImageUrl)
          }
        );
      })
      if(typeof imageResponse === "string"){
        return imageResponse
      }
      return ""
    } catch (error: any) {
      const message = error.message;
      throw new ServerError(message);
    }
  }
}

export default AIGenerator;

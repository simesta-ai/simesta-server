import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Check the clarifai-nodejs module and include these classes in the index.d.ts file
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
  private readonly clarifaiModel: typeof ClarifaiStub;
  private readonly clarifaiMetadata;
  private converter: Converter;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_CLOUD_API_KEY as string
    );
    this.textModel = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.clarifaiModel = ClarifaiStub.grpc();
    this.clarifaiMetadata = new grpc.Metadata();
    this.clarifaiMetadata.set("authorization", "Key " + process.env.PAT);
    this.converter = new Converter();
    this.cloudinaryService = new CloudinaryService();
  }

  private async generateText(prompt: string): Promise<string> {
    try {
      // const result = await this.textModel.generateContent(prompt);
      // const response = result.response;
      // const text = response.text();

      const textResponse: string = await new Promise((resolve, reject) => {
        this.clarifaiModel.PostModelOutputs(
          this.clarifaiTextModelConfig(prompt),
          this.clarifaiMetadata,
          async (err: any, response: any) => {
            if (err) {
              reject(err);
            }
            if (response.status.code !== 10000) {
              reject(err);
            }
            
            const output = response.outputs[0];
            const text = output.data.text.raw;
            resolve(text);
          }
        );
      });
      return textResponse;
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
  private clarifaiTextModelConfig(prompt: string) {
    return {
      user_app_id: {
        user_id: process.env.TEXT_MODEL_USER_ID,
        app_id: process.env.TEXT_MODEL_APP_ID,
      },
      model_id: process.env.TEXT_MODEL_ID,
      version_id: process.env.TEXT_MODEL_VERSION_ID,
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
    const prompt = `generate a list of topics(in text only, numbered form without description or prelude or formatting and removing the subtopics) needed to completely learn ${courseTitle} course`;
    const topicsText = await this.generateText(prompt);

    // Convert text list to array of topics
    const topicList = this.converter.textToArray(topicsText);
    return topicList;
  }

  //Generate Topics With File
  async generateTopicsWithFile(
    courseTitle: string,
    courseFiles: string[]
  ): Promise<Array<string>> {
    const prompt = `generate a list of topics(in text only, numbered form without description or prelude or formatting and removing the subtopics) needed to completely learn ${courseTitle} you can go through this array of ${courseFiles} and generate topics as needed`;
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
    const prompt = `generate a list of lectures only(in text only, numbered form without description or prelude or formatting and removing the sub lectures) needed to completely learn ${topicTitle} topic in ${courseTitle} course`;
    const lecturesText = await this.generateText(prompt);

    // Convert text list to array of lectures
    const lectureList = this.converter.textToArray(lecturesText);
    return lectureList;
  }
  // Generate Topic Lectures with course files
  async generateLecturesWithFiles(
    courseTitle: string,
    topicTitle: string,
    courseFiles: string
  ): Promise<string[]> {
    const prompt = `generate a list of lectures only(in text only, numbered form without description or prelude or formatting and removing the sub lectures) needed to completely learn ${topicTitle} topic in ${courseTitle} course, using these learning materials provided: ${courseFiles}`;
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
  //   Generate Lecture text
  async generateLectureTextWithFiles(
    lectureTitle: string,
    courseFiles: string
  ): Promise<string> {
    const prompt = `generate a comprehensive but well explanatory lecture in form of sectioned texts that each teach a main idea with necessary bullet points and formatted texts teaching ${lectureTitle}. Read the course material provided here and extract the content related to this lecture and use it to teach the lecture. Material: ${courseFiles}`;
    const lectureText = await this.generateText(prompt);
    return lectureText;
  }

  //  Generate course Image
  async generateCourseImage(courseTitle: string): Promise<string> {
    try {
      const prompt = `generate an graphical illustration that represents the concept of ${courseTitle}`;
      const imageResponse = await new Promise((resolve, reject) => {
        this.clarifaiModel.PostModelOutputs(
          this.clarifaiImageModelConfig(prompt),
          this.clarifaiMetadata,
          async (err: any, response: any) => {
            if (err) {
              reject(err);
            }
            if (response.status.code !== 10000) {
              reject(err);
            }
            const imageBuffer = response.outputs[0].data.image.base64;
            const secureImageUrl =
              await this.cloudinaryService.uploadImageBufferToCloud(
                imageBuffer
              );
            resolve(secureImageUrl);
          }
        );
      });
      if (typeof imageResponse === "string") {
        return imageResponse;
      }
      return "";
    } catch (error: any) {
      const message = error.message;
      throw new ServerError(message);
    }
  }
}

export default AIGenerator;

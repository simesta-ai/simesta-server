import {
  GoogleGenerativeAI,
  GenerativeModel,
} from "@google/generative-ai";
import OpenAI from "openai";
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"
import fs from "fs";
import { ServerError } from "../handlers/error";
import dotenv from "dotenv";
import Converter from "../handlers/converter";

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config();

class AIGenerator {
  private readonly genAI: GoogleGenerativeAI;
  private readonly textModel: GenerativeModel;
  private readonly imageModel: GenerativeModel;
  private converter: Converter;

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_CLOUD_API_KEY as string
    );
    this.textModel = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.imageModel = this.genAI.getGenerativeModel({ model: "imagen" });
    this.converter = new Converter();
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
  async generateCourseImage(courseTitle: string): Promise<void> {
    try {
      const prompt = `generate an graphical illustration that represents the concept of ${courseTitle}`;
      const stub = ClarifaiStub.grpc();
      const metadata = new grpc.Metadata();
      metadata.set("authorization", "Key " + process.env.PAT);
      stub.PostModelOutputs(
        {
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
        },
        metadata,
        (err: any, response: any) => {
          if (err) {
            throw new ServerError(err);
          }

          if (response.status.code !== 10000) {
            throw new ServerError(
              "Post models failed, status: " + response.status.description
            );
          }
          const output = response.outputs[0].data.image.base64;
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
          })

          let cld_upload_stream = cloudinary.uploader.upload_stream(
            {
              folder: "course-images"
            },
            function(error, result) {
                console.log(result?.secure_url);
            }
        );
        
        streamifier.createReadStream(output).pipe(cld_upload_stream);
        }
      );
    } catch (error: any) {
      const message = error.message;
      throw new ServerError(message);
    }
  }
}

export default AIGenerator;

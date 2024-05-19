import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv";


dotenv.config()
const API = process.env.GOOGLE_CLOUD_API_KEY as string
const genAI = new GoogleGenerativeAI(API)

const generateCourseDescription = async (courseTitle: string) : Promise<string> =>   {
    // initialize generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const prompt = `generate a 50 word description for a ${courseTitle} course that describes what would be learnt and areas that would be covered`
  
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text
  }

const generateCoursecategory = async (courseTitle: string) : Promise<string> => {

  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const prompt = `generate a 1 word category for a ${courseTitle} course`
  
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text
}


const generateTopics = async(courseTitle: string) => {
  const topicNames = []
}

const generateLectureText = async(lectureTitle: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const prompt = `generate a comprehensive but well explanatory lecture in form of paragraphed texts with necessary bullet points and formatted texts teaching ${lectureTitle}`
  
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text

}

const generators = { generateCourseDescription, generateCoursecategory, generateLectureText }
export default generators;
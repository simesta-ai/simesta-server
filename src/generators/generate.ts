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
  const topics: string[] = []
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const prompt = `generate a list of topics(in text only, numbered form without description and removing the subtopics) needed to completely learn ${courseTitle} course`
  
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const topicsList = text.trim().split(/\r?\n/);
    topicsList.forEach((topic) => {
      const components = topic.trim().split(".")
      const title = components[1].trim()
      topics.push(title)
    })

    return topics
}

const generateLectures = async(courseTitle: string, topicTitle: string) => {
  const lectures: string[] = []
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const prompt = `generate a list of lectures only(in text only, numbered form without description and removing the sub lectures) needed to completely learn ${topicTitle} topic in ${courseTitle} course`
  
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const lecturesList = text.trim().split(/\r?\n/);
    lecturesList.forEach((lecture) => {
      const components = lecture.trim().split(".")
      const title = components[1].trim()
      lectures.push(title)
    })

    return lectures

}

const generateLectureText = async(lectureTitle: string) => {
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const prompt = `generate a comprehensive but well explanatory lecture in form of paragraphed texts with necessary bullet points and formatted texts teaching ${lectureTitle}`
  
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text

}

const generators = { generateCourseDescription, generateCoursecategory, generateLectureText, generateTopics, generateLectures }
export default generators;
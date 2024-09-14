import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

// Check the clarifai-nodejs module and include these classes in the index.d.ts file
const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc')

import CloudinaryService from './cloudinary'
import { ServerError } from '../handlers/error'
import dotenv from 'dotenv'
import Converter from '../handlers/converter'
import { IIdeaContent } from '../../../types'

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

class AIGenerator {
  private readonly genAI: GoogleGenerativeAI
  private readonly textModel: GenerativeModel
  private readonly clarifaiModel: typeof ClarifaiStub
  private readonly clarifaiMetadata
  private converter: Converter
  private cloudinaryService: CloudinaryService

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_CLOUD_API_KEY as string
    )
    this.textModel = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    this.clarifaiModel = ClarifaiStub.grpc()
    this.clarifaiMetadata = new grpc.Metadata()
    this.clarifaiMetadata.set('authorization', 'Key ' + process.env.PAT)
    this.converter = new Converter()
    this.cloudinaryService = new CloudinaryService()
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
              reject(err)
            }
            if (response.status.code !== 10000) {
              reject(err)
            }

            const output = response.outputs[0]
            const text = output.data.text.raw
            resolve(text)
          }
        )
      })
      return textResponse
    } catch (error: any) {
      const message = error.message
      throw new ServerError(message)
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
    }
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
    }
  }

  //Confirm if a course title is valid
  async confirmCourseTitle(courseTitle: string): Promise<boolean> {
    const prompt = `confirm if ${courseTitle} is a valid course title, if is return only yes, if not return only no. The course title can be anything as far as it has meaning`
    const response = await this.generateText(prompt)
    return response.trim().toLowerCase() === 'yes' ? true : false
  }

  // Generate Course Category
  async generateCoursecategory(courseTitle: string): Promise<string> {
    const prompt = `generate a 1 word category for a ${courseTitle} course`
    const categoryText = await this.generateText(prompt)
    return categoryText
  }

  //  Generate Course Description
  async generateCourseDescription(courseTitle: string): Promise<string> {
    const prompt = `generate a 50 word description for a ${courseTitle} course that describes what would be learnt and areas that would be covered`
    const courseDescription = await this.generateText(prompt)
    return courseDescription
  }

  //  Generate Course Topics
  async generateTopics(
    courseTitle: string,
    courseFiles?: string,
    subtopics?: string
  ): Promise<Array<string>> {
    let prompt = `generate a list of topics(not more than 15, in text only, numbered form without description or prelude or formatting and removing the subtopics) needed to completely learn ${courseTitle}`
    if (courseFiles) {
      prompt += `. Go through these files to know what topics should be included ${courseFiles}`
    }
    if (subtopics) {
      prompt += `, and make sure to include these subtopics if they are relevant to the course ${subtopics}`
    }
    const topicsText = await this.generateText(prompt)

    // Convert text list to array of topics
    const topicList = this.converter.textToArray(topicsText)
    return topicList
  }

  async generateIdeaContent(
    lectureTitle: string,
    courseFiles?: string[]
  ): Promise<IIdeaContent[]> {
    let prompt = `Generate a comprehensive and well-explained set of ideas to give a complete understanding of ${lectureTitle}, namely the text explaining the idea itself, (the text is the main explainer of the idea it was actually teaches a user) a short image description that tries to make the idea clearer (optional), do note that the image generated would be for an image model so it doesn't have to be so long, and an optional quiz section that tests the understanding of the idea. If an idea doesn't have an image or quiz section, just leave the section empty. The Quiz section should consisit of sections: question, options, explanation, and correct answer aslo ensure for every questions there is a minimum of 4 options, if you don't have sufficient you can as well leave the Quiz section blank. Ensure that every time every Idea is generated every content section(meaning that an Idea should look like this =  
    ###Idea 
    ##Idea Text : An explanation of the idea (that is mandatory)
    ##Image Description : A description of the image that explains the idea that is optional(if you don't deem it necessary you can leave it blank) but ensure the section is present
    ##Quiz Section : A section that tests the understanding of the idea that is optional(if you don't deem it necessary you can leave it blank,on an occasion where it is blank, it should be left as ##Quiz Section without any content but if it is present, 
    the Quiz Section must look like this
    #Question : The question that is being asked
    #Options : The options for the question separated by a semicolon(;) minimum of 4 options
    #Explanation : The explanation for the question
    #Correct Answer : The correct answer for the question
    ) but ensure the section is present

    ) must be present whether they have content or not that is the sections separated by the '##' .

    Make the output of your response be in JSON format.
    that is the output should be in this format
    follow this format strictly and do not deviate from it or add irrelevant information to it.
    therei no need to add json or any character to the response, just the JSON object

    Generate as much ideas as possible for the lecture ${lectureTitle} to give a comprehensive understanding of the topic.

 starting here-> {
    "ideaContent": [
        {
            "text": "Operators are special symbols that perform specific operations on values.",
            "imageDescription": "A diagram showing different types of operators with their symbols and descriptions.",
            "quiz": {
                "question": "Which of the following is NOT a valid arithmetic operator?",
                "options": ["+", "-", "*", "/", "%", "^"],
                "explanation": "The caret symbol (^) is used for bitwise XOR.",
                "correct_answer": "^"
            }
        }
        {
            "text": "Operators are special symbols that perform specific operations on values.",
            "imageDescription": "A diagram showing different types of operators with their symbols and descriptions.",
            "quiz": {
                "question": "Which of the following is NOT a valid arithmetic operator?",
                "options": ["+", "-", "*", "/", "%", "^"],
                "explanation": "The caret symbol (^) is used for bitwise XOR.",
                "correct_answer": "^"
            }
        }
    ]
}<-ending here`

    if (courseFiles) {
      prompt += ` Reference these provided files as well when generating the lecture ideas: ${courseFiles.join(
        ', '
      )}`
    }
    const rawIdeaContent = await this.generateText(prompt)
    if(!rawIdeaContent) {
      return []
    }
    const cleanedContent = rawIdeaContent
      .replace(/```json\s*|\s*```/g, '')
      .trim()
    const { ideaContent } = JSON.parse(cleanedContent)

    return ideaContent
  }

  // Generate Topic Lectures
  async generateLectures(
    courseTitle: string,
    topicTitle: string,
    courseFiles?: string
  ): Promise<string[]> {
    let prompt = `generate a list of lectures only(not more than 15, in text only, numbered form without description or prelude or formatting and removing the sub lectures) needed to completely learn ${topicTitle} topic in ${courseTitle} course`

    if (courseFiles) {
      prompt += `. Go through these files to know what lectures should be included ${courseFiles}`
    }
    const lecturesText = await this.generateText(prompt)

    // Convert text list to array of lectures
    const lectureList = this.converter.textToArray(lecturesText)
    return lectureList
  }

  //   Generate Lecture text
  async generateLectureText(lectureTitle: string): Promise<string> {
    const prompt = `generate a comprehensive but well explanatory lecture in form of paragraphed texts with necessary bullet points and formatted texts teaching ${lectureTitle}`
    const lectureText = await this.generateText(prompt)
    return lectureText
  }
  //   Generate Lecture text
  async generateLectureTextWithFiles(
    lectureTitle: string,
    courseFiles: string
  ): Promise<string> {
    const prompt = `generate a comprehensive but well explanatory lecture in form of sectioned texts that each teach a main idea with necessary bullet points and formatted texts teaching ${lectureTitle}. Read the course material provided here and extract the content related to this lecture and use it to teach the lecture. Material: ${courseFiles}`
    const lectureText = await this.generateText(prompt)
    return lectureText
  }

  //  Generate course Image
  async generateCourseImage(courseTitle: string): Promise<string> {
    try {
      const prompt = `generate an graphical illustration that represents the concept of ${courseTitle}`
      const imageResponse = await new Promise((resolve, reject) => {
        this.clarifaiModel.PostModelOutputs(
          this.clarifaiImageModelConfig(prompt),
          this.clarifaiMetadata,
          async (err: any, response: any) => {
            if (err) {
              reject(err)
            }
            if (response.status.code !== 10000) {
              reject(err)
            }
            const imageBuffer = response.outputs[0].data.image.base64
            const secureImageUrl =
              await this.cloudinaryService.uploadImageBufferToCloud(imageBuffer)
            resolve(secureImageUrl)
          }
        )
      })
      if (typeof imageResponse === 'string') {
        return imageResponse
      }
      return ''
    } catch (error: any) {
      const message = error.message
      throw new ServerError(message)
    }
  }
}

export default AIGenerator
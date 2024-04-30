import { GoogleGenerativeAI } from "@google/generative-ai"
import { Request, Response } from "express"

const API = process.env.GOOGLE_CLOUD_API_KEY as string
const genAI = new GoogleGenerativeAI(API)

const run = async (inputPrompt: string) => {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    // const prompt = "Write a story about a magic backpack."
  
    const result = await model.generateContent(inputPrompt);
    const response = result.response;
    const text = response.text();
    return text
  }


export const generate = (req: Request, res:Response) => {
    const inputPrompt = req.body.inputPrompt;
    try {
        run(inputPrompt).then((generatedText) => {
          res.status(200).json(generatedText);
        })
    } catch (error: any) {
        res.status(500).json(error.message);
    }

}
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import { startPrompt } from './prompts'

dotenv.config()



const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY as string)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
const chat = model.startChat({ history: [] })

class AIMessenger {
  public async startLearningStylePrediction(name: string) {
    try {
        const result = await chat.sendMessage(startPrompt(name))
        const text = result.response.text()
        return text
      } catch (error) {
        return ''
      }
  }
  public async chat(message: string) {
    try {
      const result = await chat.sendMessage(message)
      const text = result.response.text()
      return text
    } catch (error) {
      return 'Sorry, I am not allowed to answer that.'
    }
  }
}

export default AIMessenger

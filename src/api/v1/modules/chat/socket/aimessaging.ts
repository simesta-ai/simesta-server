import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const startPrompt = ""

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY as string)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
const chat = model.startChat({ history: [] })

class AIMessenger {
  public startLearningStylePrediction() {

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

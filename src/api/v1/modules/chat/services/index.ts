/**
 * file: chat/services/index.ts
 * author: Samuel Emeka<@samthemogul>
 * Date: 06/09/24
 */

import fs from 'fs'
const sdk = require('microsoft-cognitiveservices-speech-sdk')
import AIGenerator from '../../../../../libs/utils/services/aigenerator'
import convertFileFormat from '../../../../../libs/utils/services/audioconverter'
import dotenv from 'dotenv'
import PreferenceRepository from '../preferenceRepository'
import { ServerError } from '../../../../../libs/utils/handlers/error'
import { redisService } from '../../../../../libs/utils/services/redis'

dotenv.config()

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY,
  process.env.SPEECH_REGION
)
speechConfig.speechRecognitionLanguage = 'en-US'

const aiGenerator = new AIGenerator()
const preferenceRepository = new PreferenceRepository()

async function fromFile(path: string) {
  convertFileFormat(path, './public/uploads/text.wav')
  const text = await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fs.existsSync('./public/uploads/text.wav')) {
        let audioConfig = sdk.AudioConfig.fromWavFileInput(
          fs.readFileSync('./public/uploads/text.wav')
        )
        let speechRecognizer = new sdk.SpeechRecognizer(
          speechConfig,
          audioConfig
        )

        speechRecognizer.recognizeOnceAsync((result: any) => {
          switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
              resolve(result.text)
              break
            case sdk.ResultReason.NoMatch:
              reject('No speech could be recognized: ')
              break
            case sdk.ResultReason.Canceled:
              const cancellation = sdk.CancellationDetails.fromResult(result)
              reject(`CANCELED: Reason=${cancellation.reason}`)
              break
          }
          speechRecognizer.close()
        })
        fs.readdir('./public/uploads', (err, files) => {
          if (err) throw err
          for (const file of files) {
            fs.unlink(`./public/uploads/${file}`, (err) => {
              if (err) throw err
            })
          }
        })
      }
    }, 3000)
  })
  return text
}

async function handleTextToSpeech(message: string, userId: string) {
  const audioPath = `./public/uploads/${Date.now()}.wav`
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioPath)

  const preference = await preferenceRepository.getUserPreference(userId)
  if (!preference) throw new ServerError("Something went wrong")

  speechConfig.speechSynthesisVoiceName = preference.speech_sythesis_voice_name

  // Create the speech synthesizer.
  let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)

  await new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(message, (result: any) => {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log(`Speech synthesized to [${audioPath}]`)
        resolve(result)
      } else {
        reject(new Error(`Error in speech synthesis, ${result.errorDetails}`))
      }
    })
  })
  synthesizer.close()
  return audioPath
}

class ChatService {
  async speechToText(file: Express.Multer.File) {
    try {
      const filePath = file.path
      const response = await fromFile(filePath)
      if (typeof response === 'string') {
        return response
      } else {
        return ''
      }
    } catch (error) {
      throw error
    }
  }
  async sendMessage(message: string) {}

  async textToSpeech(text: string, userId:string) {
    try {
      const audioPath = await handleTextToSpeech(text, userId)
      if (typeof audioPath === 'string') {
        return audioPath
      } else {
        return ''
      }
    } catch (error) {
      throw error
    }
  }
  async textToImage(text: string) {
    try {
      const imageUrl = await aiGenerator.generateImageOpenAI(
        text,
        '1792x1024',
        'vivid'
      )
      if (typeof imageUrl === 'string') {
        return imageUrl
      } else {
        return ''
      }
    } catch (error) {
      throw error
    }
  }
  async setSpeechNamePreference(
    speechSythesisVoiceName: string,
    userId: string
  ) {
    try {
      const response = await preferenceRepository.setSpeechPreference(
        speechSythesisVoiceName,
        userId
      )
      return response
    } catch (error) {
      throw error
    }
  }
}

export default ChatService

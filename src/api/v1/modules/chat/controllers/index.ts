/*
 * @file controllers/index.ts
 * @author [Emeka Samuel]
 * @github [https://github.com/samthemogul]
 * @description Defines controller to handle speech-to-text requests.
 * @created [2024-09-09]
 * @lastModified [2024-09-15]
 * @module api/v1/modules/chat
 */

import { NextFunction, Request, Response } from 'express'
import ChatService from '../services'
import {
  ServerError,
  ValidateError,
} from '../../../../../libs/utils/handlers/error'

const chatService = new ChatService()
class ChatController {
  constructor() {}
  async speechToText(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.file) 
      if (req.file) {
        const file = req.file
        console.log(file)
        const response = await chatService.speechToText(file)
        if (response && response.length > 0) {
          res.status(200).json({
            message: 'Speech to text conversion successful',
            data: response,
          })
        } else {
          res.status(400).json({
            message: 'Speech to text conversion failed',
            data: null,
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }
  async textToSpeech(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body
      if (!text) {
        throw new ValidateError('Invalid value')
      }
      const response = await chatService.textToSpeech(text)
      if (response && response.length > 0) {
        res.download(response, (err) => {
          if (err) {
            next(new ServerError('File not found'))
          }
        })
      } else {
        res.status(400).json({
          message: 'Text to speech conversion failed',
          data: null,
        })
      }
    } catch (error) {
      next(error)
    }
  }
  async textToImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body
      if (!text) {
        throw new ValidateError('Invalid value')
      }
      const response = await chatService.textToImage(text)
      if (response && response.length > 0) {
        res.status(200).json({
          message: 'Text to Image conversion successful',
          data: response,
        })
      } else {
        res.status(400).json({
          message: 'Text to Image conversion failed',
          data: null,
        })
      }
    } catch (error) {
     next(error) 
    }
  }
}

export default ChatController

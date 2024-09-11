import express from 'express'
import ChatController from './controllers'
import { uploadAudio } from '../../../../libs/utils/services/multer'

const router = express.Router()
const chatController = new ChatController()

router.post(
  '/speech-to-text',
  uploadAudio.single('audio'),
  chatController.speechToText
)

export default router

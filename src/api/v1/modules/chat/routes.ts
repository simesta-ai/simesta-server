/*
 * @file chat/routes.ts
 * @author [Emeka Samuel]
 * @github [https://github.com/samthemogul]
 * @description Defines the user routes for speech to text conversion.
 * @created [2024-09-09]
 * @lastModified [2024-09-15]
 * @module api/v1/modules/chat
 */

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
router.post('/text-to-speech', chatController.textToSpeech)
router.post('/text-to-image', chatController.textToImage)
router.put(
  '/set-speech-name-preference',
  chatController.setSpeechNamePreference
)

export default router

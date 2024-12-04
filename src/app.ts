import express from 'express'
import dotenv from 'dotenv'
import AppController from './api/v1/initiators/appController'
import { Server } from 'socket.io'
import SocketController from './api/v1/modules/chat/socket'
import 'reflect-metadata'
import logger from './libs/utils/logger'


// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

// Start Application Servers
export const app = express()


const PORT = process.env.PORT as string
const appController = new AppController(app, PORT)
const httpServer = appController.startApp()
export const io = new Server(httpServer)
io.on('connection', async (socket) => {
  logger.info(`user with id: ${socket.id} connected`)
  socket.on('disconnect', () => {
    logger.info(`user with id: ${socket.id} disconnected`)
  })
    const socketController = new SocketController(socket)
    await socketController.initializeMessaging()
  
})


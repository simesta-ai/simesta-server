import express from 'express'
import dotenv from 'dotenv'
import AppController from './api/v1/initiators/appContoller'
import { createServer } from 'http'
import { Server } from 'socket.io'
import SocketController from './api/v1/modules/chat/socket'
import 'reflect-metadata'
import logger from './libs/utils/logger/logger'

// const server = http.Server()
// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

// Start Application Servers
export const app = express()
const socketServer = createServer()
export const io = new Server(socketServer)
io.on('connection', (socket) => {
  logger.info(`user with id: ${socket.id} connected`)
  socket.on('disconnect', () => {
    logger.info(`user with id: ${socket.id} disconnected`)
  })
    const socketController = new SocketController(socket)
    socketController.initializeMessaging()
  
})

const PORT = process.env.PORT as string
const appController = new AppController(app, PORT)
appController.startApp()
socketServer.listen(4000, () => {
  logger.info('Socket listening on port 4000')
})

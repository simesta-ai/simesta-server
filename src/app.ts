import express from 'express'
import dotenv from 'dotenv'
import AppController from './api/v1/initiators/appContoller'
import http from 'http'
import 'reflect-metadata'

// const server = http.Server()
// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

// Start Application Server
export const app = express()
const PORT = process.env.PORT as string
const appController = new AppController(app, PORT)
appController.startApp()

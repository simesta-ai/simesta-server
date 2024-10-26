/**
 * @file user/routes.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the user routes for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/user
 *
 * //@typedef {import('express').Router} Router
 */
import express from 'express'
import UserController from './controllers'

const router = express.Router()
const userController = new UserController()

router.get('/:userId', userController.getUser)


export default router

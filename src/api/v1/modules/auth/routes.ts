/**
 * @file auth/routes.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the authentication routes for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/auth
 *
 * //@typedef {import('express').Router} Router
 * //@typedef {import('./controllers').default} AuthController
 * //@typedef {import('../../../../libs/middlewares/validators/user.validator').default} UserValidator
 */

import express from 'express'
import AuthController from './controllers'
import Uservalidator from '../../../../libs/middlewares/validators/user.validator'

const router = express.Router()
const authController = new AuthController()
const userValidator = new Uservalidator()

router.post('/register', userValidator.validate, authController.register)
router.post('/login', userValidator.validate, authController.login)

// router.post('/signup', userValidator.validate, authController.register)
// router.get('/login', userValidator.validate, authController.login)
// router.get('/google', authController.googleSignIn)
// router.get('/google/callback', authController.googleCallback)

export default router

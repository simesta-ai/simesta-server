import NotificationController from './controllers'
import express from 'express'
const router = express.Router()
const notificationController = new NotificationController()

router.post('/allow', notificationController.allowNotifications)
router.get('/user/:userId', notificationController.getAllUserNotifications)

export default router

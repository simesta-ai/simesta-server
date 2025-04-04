import { NextFunction, Request, Response } from 'express'
import allowNotifications from '../services/allowNotifications'
import getAllUserNotifications from '../services/getAllUserNotifications'

class NotificationController {
  constructor() {}
  async allowNotifications(req: Request, res: Response, next: NextFunction) {
    const { userId, token } = req.body
    try {
      await allowNotifications(userId, token)
      res.status(200).json({ message: 'Notification allowed successfully' })
    } catch (err) {
      next(err)
    }
  }
  async getAllUserNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { userId } = req.params
    try {
      const notifications = await getAllUserNotifications(userId)
      res.status(200).json({ notifications })
    } catch (err) {
      next(err)
    }
  }
}

export default NotificationController

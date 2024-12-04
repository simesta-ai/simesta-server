/**
 * @file user/controllers/index.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the user controllers for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/user
 */

import { Request, Response, NextFunction } from 'express'
import CourseController from '../../course/controllers'
import UserService from '../services'

const courseService = new CourseController()
const user = new UserService()


class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    try {
      const fetchedUser = await user.getUserById(userId)
      res.status(200).json({
        message: 'User fetched successfully',
        success: true,
        data: fetchedUser,
      })
    } catch (error) {
      next(error)
    }

  }
  async getStreak(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    try {
      const { data, error} = await user.getStreak(userId)
      if (error) {
        throw error
      }
      if(data == null) {
        res.status(404).json({
          message: 'User not found',
          success: false,
          data: null,
        })
      }
      res.status(200).json({
        message: 'User streak fetched successfully',
        success: true,
        data,
      })
    } catch (error) {
      next(error)
    }
  }
  async updateLastLearningDate(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    try {
      const { data, error} = await user.updateLastLearning(userId)
      if (error) {
        throw error
      }
      if(data == null) {
        res.status(404).json({
          message: 'User not found',
          success: false,
          data: null,
        })
      }
      res.status(200).json({
        message: 'User activity updated successfully',
        success: true,
        data,
      })
    } catch (error) {
      next(error)
    }
  }
}

export default UserController

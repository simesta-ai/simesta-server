/**
 * @file user/services/index.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the user services for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/user
 */

import UserRepository from '../repository'
import { redisService } from '../../../../../libs/utils/services/redis'
import { ClientError } from '../../../../../libs/utils/handlers/error'
import logger from '../../../../../libs/utils/logger'
import NotificationService from '../../notifications/services/notifications'
import EmailService from '../../email/services'
import {
  getRandomStreakMessage,
  generateRandomStreakmailSubject,
} from './randomStreakMessage'
import generateBadgeEmail from './streakMail'

const userRepository = new UserRepository()
const notificationService = new NotificationService()
const emailService = new EmailService()

class UserService {
  async getUserById(id: string) {
    try {
      const cachedUser = await redisService.hgetall(`user:${id}`)
      if (cachedUser && Object.keys(cachedUser).length > 0) {
        return cachedUser
      }
      const user = await userRepository.findById(id)
      if (!user) {
        throw new ClientError('User not found')
      }
      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      }
      setImmediate(async () => {
        try {
          await redisService.hset(`user:${user.email}`, user)
          await redisService.hset(`user:${user.id}`, user)
          await redisService.setExpirationTime(`user:${user.id}`, 172800)
          await redisService.setExpirationTime(`user:${user.email}`, 172800)
          logger.info(`User with email: ${user.email} cached successfully`)
        } catch (error) {
          logger.error(`Error caching user with email: ${user.email}`, error)
        }
      })
      return data
    } catch (error) {
      logger.error('Failed to get user by id', error)
      return null
    }
  }

  async getStreak(userId: string) {
    try {
      let data = null
      let error = null
      const user = await userRepository.findById(userId)
      if (!user) {
        error = new ClientError('User not found')
        return { data, error }
      }
      const lastLearningDate = new Date(user.lastLearningDate).getTime()
      const currentDate = new Date().getTime()
      const diff = currentDate - lastLearningDate
      if (diff > 24 * 60 * 60 * 1000) {
        await userRepository.updateStreak(user.id, 0)
        data = 0
      } else {
        data = user.streakCount
      }
      return { data, error }
    } catch (error) {
      logger.error('Failed to get user streak', error)
      return { data: null, error }
    }
  }

  async monitorStreak(userId: string) {
    try {
      const user = await userRepository.findById(userId)
      if (!user) {
        throw new ClientError('User not found')
      }
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)

      const lastLearningDate = new Date(user.lastLearningDate)

      if (lastLearningDate.getTime() === yesterday.getTime()) {
        const newStreak = user.streakCount + 1
        const userToken = await redisService.get(`userId:${userId}:token`)
        const message = getRandomStreakMessage(newStreak)
        if (userToken) {
          await notificationService.sendNotification(
            message.title,
            message.subtitle,
            message.body,
            userToken
          )
        }
        const badgeStreaks = [1, 3, 7, 14, 21, 30, 50, 75, 100, 150, 200]
        if (badgeStreaks.indexOf(newStreak) >= 0) {
          const html = generateBadgeEmail(user.name, newStreak, message.title)
          const subject = generateRandomStreakmailSubject()
          const sentResult = await emailService.sendMail(
            user.email,
            subject,
            undefined,
            html
          )
          if (!sentResult) {
            logger.error('Could not send streak email')
            return
          }
        }
        await userRepository.updateStreak(user.id, newStreak)
      } else {
        await userRepository.updateStreak(user.id, 0)
      }
    } catch (error) {
      logger.error('Failed to monitor user streak', error)
    }
  }

  async updateLastLearning(userId: string) {
    try {
      let data = null
      let error = null
      const user = await userRepository.findById(userId)
      if (!user) {
        error = new ClientError('User not found')
        return { data, error }
      }
      const updatedUser = await userRepository.updateLastLearning(userId)
      if (!updatedUser) {
        error = new ClientError('Failed to update user last learning date')
      }
      return { data: updatedUser, error: null }
    } catch (error) {
      logger.error('Failed to update last learning date', error)
      return { data: null, error }
    }
  }
}

export default UserService

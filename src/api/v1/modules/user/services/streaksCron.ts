import cron from 'node-cron'
import UserService from './index'
import logger from '../../../../../libs/utils/logger'
import { redisService } from '../../../../../libs/utils/services/redis'

const userService = new UserService()

const monitorUserStreaks = async () => {
  try {
    const keys = await redisService.scan('userId:id:*')
    const allUsers = await Promise.all(
      keys.map(async (key) => {
        const user = await redisService.hgetall(key)
        return user
      })
    )
    if (!allUsers || allUsers.length === 0) {
      logger.info('No users found to monitor streaks.')
      return
    }

    for (const user of allUsers) {
      if (!user) {
        continue
      }
      try {
        await userService.monitorStreak(user.id) // Monitor each user's streak
        logger.info(`Streak monitored for user with ID: ${user.id}`)
      } catch (error) {
        logger.error(
          `Error monitoring streak for user with ID: ${user.id}`,
          error
        )
      }
    }

    logger.info('All user streaks monitored successfully.')
  } catch (error) {
    logger.error('Error monitoring user streaks:', error)
  }
}

const dailyStreakMonitoring = cron.schedule('0 0 * * *', monitorUserStreaks)

export { dailyStreakMonitoring }

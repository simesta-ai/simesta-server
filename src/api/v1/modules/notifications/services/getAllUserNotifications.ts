import { redisService } from '../../../../../libs/utils/services/redis'

const getAllUserNotifications = async (userId: string) => {
  try {
    const notifications = await redisService.hgetall(
      `userId:${userId}:notifications`
    )
    return notifications
  } catch (err) {
    throw new Error('Could not get notifications, ' + err)
  }
}

export default getAllUserNotifications

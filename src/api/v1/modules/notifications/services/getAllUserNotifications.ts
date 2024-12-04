import { redisService } from '../../../../../libs/utils/services/redis'

const getAllUserNotifications = async (userId: string) => {
  try {
    const notificationsList: any[] = []
    const pattern = `userId:${userId}:notification:*`
    const notificationKeys = await redisService.keys(pattern)
    for(const key of notificationKeys) {
      const notification = await redisService.hgetall(key)
      notificationsList.push(notification)
    }
    if(notificationsList.length > 0) {
      return notificationsList
    }
    return null
  } catch (err) {
    throw new Error('Could not get notifications, ' + err)
  }
}

export default getAllUserNotifications

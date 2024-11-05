import { redisService } from '../../../../../libs/utils/services/redis'

const allowNotifications = async (userId: string, expoToken: string) => {
  try {
    await redisService.set(`userId:${userId}:token`, expoToken)
  } catch (err) {
    throw new Error('Could not allow notifications, ' + err)
  }
}

export default allowNotifications

import { Queue, Worker } from 'bullmq'
import dotenv from 'dotenv'
import { Expo, ExpoPushMessage } from 'expo-server-sdk'
dotenv.config()
import logger from '../../../../../libs/utils/logger'
import CourseRepository from '../../course/repository'
import { redisService } from '../../../../../libs/utils/services/redis'


const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_SECRET,
  tls: { rejectUnauthorized: false },
}

const courseRepository = new CourseRepository()

dotenv.config()

class NotificationService {
  private notificationQueue: Queue
  private expo: Expo

  constructor() {
    this.notificationQueue = new Queue('notifications', {
      connection: redisConnection,
    })
    this.expo = new Expo()
    this.initializeNotificationWorker()
  }

  private async sendNotification(
    notificationTitle: string,
    notificationSubtitle: string,
    notificationBody: string,

    expoPushToken: string
  ) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.error(
        `Push token ${expoPushToken} is not a valid Expo push token`
      )
      return
    }

    const messages: ExpoPushMessage[] = [
      {
        to: expoPushToken,
        sound: 'default',
        title: notificationTitle,
        subtitle: notificationSubtitle,
        body: notificationBody,
      },
    ]

    try {
      const ticketChunk = await this.expo.sendPushNotificationsAsync(messages)
      console.log('Successfully sent notification:', ticketChunk)
      logger.info('Successfully sent notification:', ticketChunk)
    } catch (error) {
      console.error('Error sending Expo push notification:', error)
      logger.error('Error sending Expo push notification:', error)
    }
  }

  private getNotificationDate() {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      year: 'numeric',
    }
    return date.toLocaleDateString('en-US', options)
  }

  private async initializeNotificationWorker() {
    new Worker(
      'notifications',
      async (job) => {
        const {
          userId,
          courseId,
          notificationType,
          notificationTitle,
          notificationSubtitle,
          notificationBody,
        } = job.data
        try {
          const token = await redisService.get(`userId:${userId}:token`)
          const course = await courseRepository.findById(courseId)
          console.log('course:', course)
          if (course && !course?.completed) {
            await this.sendNotification(
              notificationTitle,
              notificationSubtitle,
              notificationBody,
              token as string
            )

            const notificationDetails = {
              type: notificationType,
              date: this.getNotificationDate(),
              notification: {
                title: notificationTitle,
                subtitle: notificationSubtitle,
                body: notificationBody,
              },
            }
            //Save notification to cache
            await redisService.hset(
              `userId:${userId}:notification`,
              notificationDetails
            )
          } else {
            console.log('Na me dey run')
          }
        } catch (error) {
          console.error('Failed to send notification:', error)
          logger.error('Failed to send notification:', error)
        }
      },
      {
        connection: redisConnection,
      }
    )
  }

  async addNotificationJob(
    userId: string,
    courseId: string,
    notificationType: string,
    notificationTitle: string,
    notificationSubtitle: string,
    notificationBody: string,
    delay: number
  ) {
    try {
      await this.notificationQueue.add(
        'send-notification',
        {
          userId,
          courseId,
          notificationType,
          notificationTitle,
          notificationSubtitle,
          notificationBody,
        },
        { delay }
      )
    } catch (error) {
      throw new Error('Failed to add notification job')
    }
  }
}

export default NotificationService

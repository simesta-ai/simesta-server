import { Queue, Worker } from 'bullmq'
import dotenv from 'dotenv'
import { Expo, ExpoPushMessage } from 'expo-server-sdk'
dotenv.config()
import logger from '../../../../../libs/utils/logger'
import CourseRepository from '../../course/repository'
import randomReminder from './randomReminder'

const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_SECRET,
  tls: { rejectUnauthorized: false },
}

const courseRepository = new CourseRepository()

import { createClient, RedisClientType } from '@redis/client'

dotenv.config()

class RedisService {
  private client: RedisClientType
  constructor(
    password: string | undefined,
    host: string | undefined,
    port: number
  ) {
    this.client = createClient({
      password: password,
      url: `redis://${host}:6379`,
    })
  }

  async createConnection(): Promise<void> {
    this.client.on('ready', () => {
      logger.info('Redis store connected')
    })
    this.client.on('error', (err) => {
      logger.error('Redis is disconnected: ', err)
    })
    try {
      await this.client.connect()
    } catch (err) {
      logger.error('Error while connecting to redis store: ', err)
    }
  }

  async keys(pattern: string) {
    return this.client.keys(pattern)
  }

  async get(key: string) {
    return this.client.get(key)
  }

  async set(key: string, value: string) {
    return this.client.set(key, value)
  }
  async delete(key: string) {
    return this.client.del(key)
  }
  async hset(key: string, object: Object) {
    try {
      for (const [field, value] of Object.entries(object)) {
        if (value == null || value == undefined) {
          await this.client.hSet(key, field, 'null')
        } else {
          await this.client.hSet(key, field, JSON.stringify(value))
        }
      }
      logger.info(`Successfully cached data for key: ${key}`)
    } catch (error) {
      logger.error(`Failed to cache data for key: ${key}`, error)
    }
  }
  async hget(key: string, field: string) {
    try {
      const data = await this.client.hGet(key, field)
      if (data == 'true') {
        return true
      } else if (data == 'false') {
        return false
      } else if (data == 'null') {
        return null
      } else if (Number(data)) {
        return Number(data)
      } else {
        return data
      }
    } catch (error) {
      logger.error(`Failed to get data for key: ${key}`, error)
      return null
    }
  }
  async hgetall(key: string) {
    const result: Record<string, any> = {}
    try {
      const data = await this.client.hGetAll(key)
      for (const [field, value] of Object.entries(data)) {
        if (value == 'true') {
          result[field] = true
        } else if (value == 'false') {
          result[field] = false
        } else if (value == 'null') {
          result[field] = null
        } else if (Number(value)) {
          result[field] = Number(value)
        } else {
          result[field] = JSON.parse(value)
        }
      }
      return result
    } catch (error) {
      logger.error(`Failed to get data for key: ${key}`, error)
      return null
    }
  }
  async updateField(key: string, field: string, value: any) {
    try {
      await this.client.hSet(key, field, value.toString())
    } catch (error) {
      logger.error(`Failed to update data for key: ${key}`, error)
    }
  }
}
const redisService = new RedisService(
  process.env.REDIS_SECRET,
  process.env.REDIS_HOST,
  Number(process.env.REDIS_PORT)
)

export const initializeRedis = async () => {
  await redisService.createConnection()
}

export { redisService }

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
          const course = await courseRepository.findByCourseAndUserId(
            userId,
            courseId
          )
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

initializeRedis()
const notification = randomReminder('Physics')
const notificationService = new NotificationService()
notificationService.addNotificationJob(
  ' 9e4b80df-3130-40a5-924f-0a26c8662e00',
  'e58cce6e-f4e9-4fdb-a286-4f131f52dd34',
  'reminder',
  notification.title,
  notification.subtitle,
  notification.body,
  10000
)

import { createClient, RedisClientType } from '@redis/client'
import logger from '../logger'
import dotenv from 'dotenv'

dotenv.config()

class RedisService {
  private client: RedisClientType
  constructor(
    password: string | undefined,
    host: string | undefined,
    port: number
  ) {
    this.client = createClient({
      password,
      socket: {
        host,
        port,
      },
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

  //get all keys matching a pattern
  async scan(MATCH: string) {
    let cursor = 0
    const keys: string[] = []
    do {
      const scanResult = await this.client.scan(cursor, {
        MATCH: MATCH,
      })
      cursor = scanResult.cursor
      keys.push(...scanResult.keys)
    } while (cursor != 0)
    return keys
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

  async setExpirationTime(key: string, time: number) {
    try {
      await this.client.expire(key, time)
    } catch (error) {
      logger.error(`Failed to set expiration time for key: ${key}`, error)
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

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
      password: password,
      url: `redis://${host}:6379`
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
    const entry = Object.entries(object).flat()
    return this.client.hSet(key, entry)
  }
  async hget(key: string, field: string) {
    return this.client.hGet(key, field)
  }
  async hgetall(key: string) {
    return this.client.hGetAll(key)
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

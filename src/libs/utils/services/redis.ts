import { RedisClientType, createClient } from 'redis'
import logger from '../logger'
import dotenv from 'dotenv'

dotenv.config()

interface IRedisService {
  client: RedisClientType
  createConnection(): void
}

class RedisService implements IRedisService {
  client: RedisClientType
  constructor(
    password: string | undefined,
    host: string | undefined,
    port: number
  ) {
    this.client = createClient({
      password: password,
      socket: {
        host: host,
        port: port,
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

  async get(key: string) {
    return this.client.get(key)
  }

  async set(key: string, value: string) {
    return this.client.set(key, value)
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

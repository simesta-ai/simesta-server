import { RedisClientType, createClient } from "redis";
import logger from "../logger";


interface IRedisService {
    client: RedisClientType
    createConnection(): void
}

class RedisService implements IRedisService {
    client: RedisClientType
    constructor(password: string | undefined, host: string | undefined, port: number){
        this.client = createClient({
            password: password,
            socket: {
                host: host,
                port: port
            }
        })
    }

    async createConnection(): Promise<void> {
        this.client.on('ready', () => {
            logger.info('Redis store connected')
          });
          
        this.client.on('error', (err) => {
            logger.error("Redis is disconnected: ", err)
        });
        try {
            await this.client.connect()
        } catch (err) {
            logger.error("Error while connecting to redis store: ", err)
        }
    }

}

export default RedisService
import { RedisClientType, createClient } from "redis";


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
            console.log('Redis store connected');
          });
          
        this.client.on('error', (err) => {
            console.log('Redis is disconnected');
        });
        try {
            await this.client.connect()
        } catch (err) {
            console.log("Error while connecting to redis store")
        }
    }

}

export default RedisService
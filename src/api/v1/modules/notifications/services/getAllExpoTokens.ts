import { redisService } from "../../../../../libs/utils/services/redis";

const getAllTokenKeys = async () => {
    let cursor = '0'
    let tokens = []
    do{
        const [newCursor, keys] = await redisService.scan(cursor, 'MATCH', 'expoToken:*')
    }while(cursor != '0')
}
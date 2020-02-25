import { RedisClient } from 'redis';

interface RedisService {
    client: RedisClient,
    del: (key: string) => Promise<void>;
    expire: (key: string, seconds: number) => Promise<void>;
    expireAt: (key: string, seconds: number) => Promise<void>;
    get: (key: string) => Promise<string>;
    set: (key: string, value: string) => Promise<void>;
}

export default RedisService;

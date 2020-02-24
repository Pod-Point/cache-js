import { ClientOpts, createClient } from 'redis';
import { promisify } from 'util';
import Expire from '../types/Expire';
import Service from '../types/Service';
import RedisService from '../types/redis/Service';

class Redis implements Service {
    private config: ClientOpts;

    private ephemeral: boolean;

    private service: RedisService;

    /**
     * Creates a Redis client instance depending on config.
     */
    public constructor(config?: ClientOpts, ephemeral?: boolean) {
        this.ephemeral = ephemeral;
        this.config = config;

        if (!this.ephemeral) {
            this.service = this.getService();
        }
    }

    /**
     * Retrieves the keys value from the cache.
     */
    public async get(key: string): Promise<string> {
        const service = this.getService();
        const value = await service.get(key);

        if (this.ephemeral) {
            service.client.quit();
        }

        return value;
    }

    /**
     * Persists the key/value pair in the cache,
     * optionally setting it to expire at a particular time or in a given number of seconds.
     */
    public async put(key: string, value: string, expire?: Expire): Promise<void> {
        const service = this.getService();

        await service.set(key, value);

        if (expire) {
            if (expire.at) {
                await service.expireAt(key, expire.at);
            }

            if (expire.in) {
                await service.expire(key, expire.in);
            }
        }

        if (this.ephemeral) {
            service.client.quit();
        }
    }

    /**
     * Removes the key/value pair from the cache.
     */
    public async remove(key: string): Promise<void> {
        const service = this.getService();

        await service.del(key);

        if (this.ephemeral) {
            service.client.quit();
        }
    }

    /**
     * Creates new Redis instance if one does not already exist or if is configured to be ephemeral.
     * If configured to be ephemeral redis actions will have event listeners on them.
     */
    private getService(): RedisService {
        if (this.ephemeral) {
            const client = createClient(this.config);
            this.service = {
                client,
                del: promisify(client.del).bind(client),
                expire: promisify(client.expire).bind(client),
                expireAt: promisify(client.expireat).bind(client),
                get: promisify(client.get).bind(client),
                set: promisify(client.set).bind(client),
            };
        }

        return this.service;
    }
}

export default Redis;

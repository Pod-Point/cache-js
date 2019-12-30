import { ClientOpts, createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import Expire from '../types/Expire';
import Service from '../types/Service';

class Redis implements Service {
    public commands: {
        del: (key: string) => Promise<void>;
        expire: (key: string, seconds: number) => Promise<void>;
        expireAt: (key: string, seconds: number) => Promise<void>;
        get: (key: string) => Promise<string>;
        set: (key: string, value: string) => Promise<void>;
    };

    private client: RedisClient;

    /**
     * Creates a redis client instance.
     */
    public constructor(config?: ClientOpts) {
        this.client = createClient(config);
        this.commands = {
            del: promisify(this.client.del).bind(this.client),
            expire: promisify(this.client.expire).bind(this.client),
            expireAt: promisify(this.client.expireat).bind(this.client),
            get: promisify(this.client.get).bind(this.client),
            set: promisify(this.client.set).bind(this.client),
        };
    }

    /**
     * Retrieves the keys value from the cache.
     */
    public async get(key: string): Promise<string> {
        return this.commands.get(key);
    }

    /**
     * Persists the key/value pair in the cache,
     * optionally setting it to expire at a particular time or in a given number of seconds.
     */
    public async put(key: string, value: string, expire?: Expire): Promise<void> {
        await this.commands.set(key, value);

        if (expire) {
            if (expire.at) {
                await this.commands.expireAt(key, expire.at);
            }

            if (expire.in) {
                await this.commands.expire(key, expire.in);
            }
        }
    }

    /**
     * Removes the key/value pair from the cache.
     */
    public async remove(key: string): Promise<void> {
        await this.commands.del(key);
    }
}

export default Redis;

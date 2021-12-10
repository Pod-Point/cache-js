import { ClientOpts, createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import Expire from '../types/Expire';
import Service from '../types/Service';

interface AsyncRedisClient {
    del: (key: string) => Promise<void>;
    expire: (key: string, seconds: number) => Promise<void>;
    expireAt: (key: string, seconds: number) => Promise<void>;
    get: (key: string) => Promise<string>;
    quit: () => void
    set: (key: string, value: string) => Promise<void>;
}

function getClient(client: RedisClient): AsyncRedisClient {
    return {
        /* eslint-disable
            @typescript-eslint/unbound-method,
            @typescript-eslint/no-unsafe-assignment
        */
        del: promisify(client.del).bind(client),
        expire: promisify(client.expire).bind(client),
        expireAt: promisify(client.expireat).bind(client),
        get: promisify(client.get).bind(client),
        quit: client.quit as () => void,
        set: promisify(client.set).bind(client),
        /* eslint-enable */
    };
}

export default class Redis implements Service {
    private readonly config: ClientOpts;

    private readonly ephemeral: boolean;

    private readonly client: AsyncRedisClient;

    /**
     * Creates a Redis client instance depending on config.
     */
    public constructor(config?: ClientOpts, ephemeral?: boolean) {
        this.ephemeral = ephemeral;
        this.config = config;
        this.client = getClient(createClient(config));
    }

    /**
     * Retrieves the keys value from the cache.
     */
    public async get(key: string): Promise<string> {
        const value = await this.client.get(key);

        this.quitIfNeeded();

        return value;
    }

    /**
     * Persists the key/value pair in the cache,
     * optionally setting it to expire at a particular time or in a given number of seconds.
     */
    public async put(key: string, value: string, expire?: Expire): Promise<void> {
        await this.client.set(key, value);

        if (expire) {
            if (expire.at) {
                await this.client.expireAt(key, expire.at);
            }

            if (expire.in) {
                await this.client.expire(key, expire.in);
            }
        }

        this.quitIfNeeded();
    }

    /**
     * Removes the key/value pair from the cache.
     */
    public async remove(key: string): Promise<void> {
        await this.client.del(key);

        this.quitIfNeeded();
    }

    /**
     * Quits the redis client if required.
     */
    private quitIfNeeded(): void {
        if (this.ephemeral) {
            this.client.quit();
        }
    }
}

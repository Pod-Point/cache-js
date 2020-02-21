import { ClientOpts, createClient, RedisClient } from 'redis';
import { EventEmitter } from 'events';
import Expire from '../types/Expire';
import Service from '../types/Service';

enum methodLabels {
    Get = 'get',
    Set = 'set',
    Del = 'del',
}

class Redis implements Service {
    private client: RedisClient = null;

    private config: ClientOpts;

    private ephemeral: boolean;

    private listenersRegistered: boolean;

    private callbacks: EventEmitter = new EventEmitter();

    /**
     * Creates a Redis client instance depending on config.
     */
    public constructor(config?: ClientOpts, ephemeral?: boolean) {
        this.ephemeral = ephemeral;
        this.config = config;
        this.listenersRegistered = false;
    }

    /**
     * Retrieves the keys value from the cache.
     */
    public async get(key: string): Promise<string> {
        let data = null;
        this.execute(methodLabels.Get, key, (error, result) => {
            data = result;
        });
        return data;
    }

    /**
     * Persists the key/value pair in the cache,
     * optionally setting it to expire at a particular time or in a given number of seconds.
     */
    public async put(key: string, value: string, expire?: Expire): Promise<void> {
        this.execute(methodLabels.Set, key, value, () => {
            if (expire) {
                if (expire.at) {
                    this.client.expireat(key, expire.at);
                }

                if (expire.in) {
                    this.client.expire(key, expire.in);
                }
            }
        });
    }

    /**
     * Removes the key/value pair from the cache.
     */
    public async remove(key: string): Promise<void> {
        this.execute(methodLabels.Del, key);
    }

    /**
     * Creates new Redis instance if one does not already exist or if is configured to be ephemeral.
     * If configured to be ephemeral redis actions will have event listeners on them.
     */
    private getClient(): RedisClient {
        if (this.ephemeral || !this.client) {
            this.client = createClient(this.config);
            if (this.ephemeral && !this.listenersRegistered) {
                this.registerListeners();
            }
        }
        return this.client;
    }

    /**
     * Attaches listeners to Redis commands.
     */
    private registerListeners() {
        Object.values(methodLabels).forEach(label => {
            this.callbacks.addListener(label, () => {
                this.client.quit();
            });
        });

        this.listenersRegistered = true;
    }

    /**
     * Executes Redis command and emits event if ephemeral.
     */
    private execute(method: methodLabels, ...args) {
        this.getClient()[method as string](...args);
        if (this.ephemeral) {
            this.callbacks.emit(method);
        }
    }
}

export default Redis;

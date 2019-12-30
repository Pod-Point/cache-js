import Redis from '../../services/Redis';

jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        del: jest.fn(),
        expire: jest.fn(),
        expireat: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
    })),
}));

describe('services/Redis', () => {
    const cache = new Redis();
    const key = 'foo';
    const value = 'bar';

    cache.commands.del = jest.fn();
    cache.commands.expire = jest.fn();
    cache.commands.expireAt = jest.fn();
    cache.commands.get = jest.fn();
    cache.commands.set = jest.fn();

    it('persists the key/value pair in the cache', async () => {
        await cache.put(key, value);

        expect(cache.commands.set).toHaveBeenCalled();
    });

    it('persists the key/value pair in the cache to expire at a particular time', async () => {
        await cache.put(key, value, {
            at: (new Date()).getTime(),
        });

        expect(cache.commands.set).toHaveBeenCalled();
        expect(cache.commands.expireAt).toHaveBeenCalled();
    });

    it('persists the key/value pair in the cache to expire in a given number of seconds', async () => {
        await cache.put(key, value, {
            in: 1,
        });

        expect(cache.commands.set).toHaveBeenCalled();
        expect(cache.commands.expire).toHaveBeenCalled();
    });

    it('retrieves the keys value from the cache', async () => {
        await cache.get(key);

        expect(cache.commands.get).toHaveBeenCalled();
    });

    it('removes the key/value pair from the cache', async () => {
        await cache.remove(key);

        expect(cache.commands.del).toHaveBeenCalled();
    });
});

import { createClient } from 'redis';
import Redis from '../../../services/Redis';

const mockSet = jest.fn((key, value, cb) => cb());
const mockQuit = jest.fn();
const mockDel = jest.fn();
const mockExpire = jest.fn();
const mockExpireAt = jest.fn();
const mockGet = jest.fn((key, cb) => cb(null, 'someData'));

jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        del: mockDel,
        expire: mockExpire,
        expireat: mockExpireAt,
        get: mockGet,
        set: mockSet,
        quit: mockQuit,
    })),
}));

describe('services/Redis', () => {
    const key = 'foo';
    const value = 'bar';

    [true, false].forEach(ephemeral => {
        const isEphemeral = ephemeral ? 'ephemeral' : 'nonEphemeral';
        const cache = new Redis({}, ephemeral);

        describe(isEphemeral, () => {
            beforeEach(() => {
                mockQuit.mockReset();
            });

            afterEach(() => {
                if (ephemeral) {
                    expect(createClient).toHaveBeenCalled();
                    expect(mockQuit).toHaveBeenCalled();
                }
            });

            it('persists the key/value pair in the cache and quits connection', async () => {
                await cache.put(key, value);

                expect(mockSet).toHaveBeenCalledWith('foo', 'bar', expect.any(Function));
            });

            it('persists the key/value pair in the cache to expire at a particular time and quits connection', async () => {
                const timestamp = (new Date()).getTime();
                await cache.put(key, value, {
                    at: timestamp,
                });

                expect(mockSet).toHaveBeenCalledWith('foo', 'bar', expect.any(Function));
                expect(mockExpireAt).toHaveBeenCalledWith(
                    'foo',
                    timestamp,
                );
            });

            it('persists the key/value pair in the cache to expire in a given number of seconds and quits connection', async () => {
                await cache.put(key, value, {
                    in: 1,
                });

                expect(mockSet).toHaveBeenCalledWith('foo', 'bar', expect.any(Function));
                expect(mockExpire).toHaveBeenCalledWith('foo', 1);
            });

            it('retrieves the keys value from the cache and quits connection', async () => {
                const data = await cache.get(key);

                expect(mockGet).toHaveBeenCalledWith('foo', expect.any(Function));
                expect(data).toEqual('someData');
            });

            it('removes the key/value pair from the cache and quits connection', async () => {
                await cache.remove(key);

                expect(mockDel).toHaveBeenCalledWith('foo');
            });
        });
    });
});

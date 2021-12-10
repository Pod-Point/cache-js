interface ExpireAt {
    /**
     * The timestamp when the key/value pair should expire.
     */
    at: number;

    in?: never;
}

interface ExpireIn {
    /**
     * The number of seconds until the key/value pair should expire.
     */
    in: number;

    at?: never;
}

type Expire = ExpireAt | ExpireIn;

export default Expire;

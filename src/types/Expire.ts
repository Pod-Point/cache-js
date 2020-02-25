interface Expire {
    /**
     * The timestamp when the key/value pair should expire.
     */
    at?: number;

    /**
     * The number of seconds until the key/value pair should expire.
     */
    in?: number;
}

export default Expire;

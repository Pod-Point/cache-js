# Cache JS

![Build Status](https://github.com/Pod-Point/cache-js/actions/workflows/run-tests.yml/badge.svg)

A cache service for JS.

## Usage

To install this package, run the following command:
```bash
npm install @pod-point/cache-js
```

Once installed, simply create a new instance of the Cache service and begin using it e.g.
```
import { Redis } from '@pod-point/cache-js';

const cacheService = new Redis();

await cacheService.put('foo', 'bar');
```

There are only 3 simple methods a cache service can carry out, and these are `put`, `get` and `remove`, all fairly self-explanatory!

When putting key/value pairs into the cache you can also set an expiry date, or a time in seconds until it should expire.

## Development

### Installation

To install this packages dependencies, run the following command:
```bash
npm install
```

### Testing

This package uses jest. To run the test suites for this project, run the following command:

```bash
npm run test
```

## License

The MIT License (MIT). Please see [License File](LICENCE) for more information.

---

<img src="https://d3h256n3bzippp.cloudfront.net/pod-point-logo.svg" align="right" />

Travel shouldn't damage the earth 🌍

Made with ❤️&nbsp;&nbsp;at [Pod Point](https://pod-point.com)

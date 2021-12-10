# Cache JS

[![Build Status](https://travis-ci.com/Pod-Point/cache-js.svg?branch=master)](https://travis-ci.com/Pod-Point/cache-js)

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

### Releases

This package is distributed via NPM and published automatically by Travis when creating a tagged commit. This can be done in one of 2 ways:

#### 1. Pre-merge via the CLI

**Before** merging your PR following code review & QA, run the following commands to update the package version and create a new release/tag.
```
npm version <major|minor|patch|prerelease>
git push && git push --tags
```

If you forget to do this before merging, this is not a problem, just create a new branch from master and run these same commands, remembering to open and merge a PR for this branch so that the `package.json` file is updated, alternatively, see option 2.

#### 2. Post-merge via code & GitHub

**After** merging your code changes, create a new branch/PR from master and update the package version in `package.json` to whatever you wish the next release to be.

**Before** merging this PR, create a release via GitHub with a tag version to match this package version number, this will trigger the tagged commit and in turn the automatic deployment to NPM.

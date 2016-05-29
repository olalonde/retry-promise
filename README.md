# retry-promise

[![Build Status](https://travis-ci.org/olalonde/retry-promise.svg)](https://travis-ci.org/olalonde/retry-promise)

Small utility function to automatically retry bluebird Promises.

## Install

```bash
npm install --save retry-promise
```

## Usage

`retry(opts, promise)`

`opts.max` max number of retries (default: `10`)
`opts.backoff` time in ms between retries (default: `1000`)

Time between retries is actually attempt_number * backoff.
Every retry waits longer.

## Example

```javascript
var retry = require('retry-promise');

retry({ max: 3, backoff: 1000 }, function (attempt) {
  console.log('Attempt', attempt, 'at creating user');
  return User
    .forge({ email: 'some@email.com' })
    .createOrLoad();
})
.then(function (user) {
  req.user = user;
  next();
})
.catch(next);
```

## Timeout Calculation

It's a little tricky to know what is the timeout for a given value of `max` and `backoff`.

### Equation

1. given timeout & backoff, to calc max:  
  ```
  max = (2 * totalTime/backoff) ^ (1/2) 
  ```
2. given max & backoff, to calc timeout:  
  ```
  timeout = max * (backoff * max) / 2
  ```

### Quick Sheet

#### 1. Lazy

| max |backoff|timeout|
|:---:|:-----:|:-----:|
| 1 |	1000 |	500   |
| 2 |	1000 |	2000  |
| 3 |	1000 |	4500  |
| 4 |	1000 |	8000  |
| 5 |	1000 |	12500 |
| 6 |	1000 |	18000 |
| 7 |	1000 |	24500 |
| 8 |	1000 |	32000 |
| 9 |	1000 |	40500 |

#### 2. Active
| max |backoff|timeout|
|:---:|:-----:|:-----:|
| 1 |	10 |	5 |
| 2 |	10 |	20 |
| 3 |	10 |	45 |
| 4 |	10 |	80 |
| 5 |	10 |	125 |
| 6 |	10 |	180 |
| 7 |	10 |	245 |
| 8 |	10 |	320 |
| 9 |	10 |	405 |

#### 3. Blanace
| max |backoff|timeout|
|:---:|:-----:|:-----:|
| 1 |	100 |	50 |
| 2 |	100 |	200 |
| 3 |	100 |	450 |
| 4 |	100 |	800 |
| 5 |	100 |	1250 |
| 6 |	100 |	1800 |
| 7 |	100 |	2450 |
| 8 |	100 |	3200 |
| 9 |	100 |	4050 |

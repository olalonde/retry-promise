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

## Wait Time Calculation

It's a little tricky to know what is the total time wait for a given value of `max` and `backoff`.

### Equation

1. given time wait & backoff, to calc max:  
  ```
  max = 1 + (2 * waitTime/backoff) ^ (1/2)
  ```
2. given max & backoff, to calc waitTime:  
  ```
  waitTime = (max - 1) * (backoff * max) / 2
  ```

### Quick Sheet

#### 1. Lazy

| max |backoff|waitTime|
|:---:|:-----:|:-----:|
| 1	| 1000	| 0 |
| 2	| 1000	| 1000 |
| 3	| 1000	| 3000 |
| 4	| 1000	| 6000 |
| 5	| 1000	| 10000 |
| 6	| 1000	| 15000 |
| 7	| 1000	| 21000 |
| 8	| 1000	| 28000 |
| 9	| 1000	| 36000 |

#### 2. Active
| max |backoff|waitTime|
|:---:|:-----:|:-----:|
| 1 |	10 |	0 |
| 2 |	10 |	10 |
| 3 |	10 |	30 |
| 4 |	10 |	60 |
| 5 |	10 |	100 |
| 6 |	10 |	150 |
| 7 |	10 |	210 |
| 8 |	10 |	280 |
| 9 |	10 |	360 |
 
#### 3. Blanace
| max |backoff|waitTime|
|:---:|:-----:|:-----:|
| 1 |	100 |	0 |
| 2 |	100 |	100 |
| 3 |	100 |	300 |
| 4 |	100 |	600 |
| 5 |	100 |	1000 |
| 6 |	100 |	1500 |
| 7 |	100 |	2100 |
| 8 |	100 |	2800 |
| 9 |	100 |	3600 |


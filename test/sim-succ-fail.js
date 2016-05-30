import co from 'co';

import test from 'blue-tape';
import retry from '../src';

test('retry can succ & fail', t => {
  co(function* () {
    const EXPECTED_RESOLVE = 'Okey';
    const EXPECTED_REJECT = 'NotTheTime';
    function delayedFactory(timeout) {
      const startTime = Date.now();
      return function() {
        const nowTime = Date.now();
        if (nowTime - startTime > timeout) {
          return Promise.resolve(EXPECTED_RESOLVE);
        }
        return Promise.reject(EXPECTED_REJECT);
      };
    }

    const delay50 = delayedFactory(50);
    yield retry({max: 1, backoff: 10}, () => {
      return delay50();
    })
    .then(() => {
      t.fail('retry-promise should not be resolved here');
    })
    .catch(e => {
      t.equal(e, EXPECTED_REJECT, `retry-promise got ${EXPECTED_REJECT} when wait not enough`);
    });

    const anotherDelay50 = delayedFactory(50);
    yield retry({max: 6, backoff: 10}, () => {
      return anotherDelay50();
    })
    .then(r => {
      t.equal(r, EXPECTED_RESOLVE, `retryPromise got "${EXPECTED_RESOLVE}" when wait enough`);
    })
    .catch(e => {
      t.fail(`should not be rejected(with ${e}) when there is enough wait`);
    });
  })
  .catch(e => { // REJECTED
    t.fail(e);
  })
  .then(() => {  // FINALLY
    t.end();
  })
  .catch(e => { // EXCEPTION
    t.fail(e);
  });
});

import test from 'blue-tape';
import retry from '../src';

test('retry success', (t) => {
  let i;
  return retry((attempt) => {
    i = attempt;
    return new Promise((resolve) => {
      process.nextTick(() => {
        resolve('something');
      });
    });
  })
  .then((res) => {
    t.equal(res, 'something');
    t.equal(i, 1);
  });
});

test('retry fail', (t) => {
  let i;
  return retry({ max: 1 }, (attempt) => {
    i = attempt;
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        reject('some err');
      });
    });
  })
  .catch((err) => {
    t.equal(err, 'some err');
    t.equal(i, 1);
  });
});

test('retry max', (t) => {
  let i;
  return retry({ max: 3, backoff: 5 }, (attempt) => {
    i = attempt;
    return Promise.reject('some err');
  })
  .catch((err) => {
    t.equal(err, 'some err');
    t.equal(i, 3);
  });
});

test('retry few times before max', (t) => {
  let i;
  return retry({ max: 5, backoff: 5 }, (attempt) => {
    i = attempt;
    if (i === 4) {
      return Promise.resolve('yay');
    }
    return Promise.reject('some err');
  })
  .then((res) => {
    t.equal(res, 'yay');
    t.equal(i, 4);
  });
});

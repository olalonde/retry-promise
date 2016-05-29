const retry = (opts = {}, getPromise) => {
  if (typeof opts === 'function') {
    return retry({}, opts);
  }

  opts.max = opts.max || 10;
  opts.backoff = opts.backoff || 1000;

  return new Promise((resolve, reject) => {
    const attempt = (i) => {
      getPromise(i)
        .then(resolve)
        .catch((err) => {
          if (i >= opts.max) {
            return reject(err);
          }
          setTimeout(() => attempt(i + 1), i * opts.backoff);
        });
    };
    attempt(1);
  });
};

module.exports = retry.default. = retry.retry = retry;

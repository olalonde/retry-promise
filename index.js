var BPromise = require('bluebird');

// Automatically retry to fullfill a promise if it fails
module.exports = function (opts, getPromise) {
  if (typeof opts === 'function') {
    getPromise = opts;
    opts = null;
  }
  opts = opts || {};
  opts.max = opts.max || 10;
  opts.backoff = opts.backoff || 1000;

  // TODO: pass arguments down
  return new BPromise(function (resolve, reject) {
    var attempt = function (i) {
      getPromise(i).then(resolve).catch(function (err) {
        if (i >= opts.max) {
          return reject(err);
        }
        setTimeout(function () {
          attempt(i+1);
        }, i * opts.backoff);
      });
    };

    attempt(1);
  });
};

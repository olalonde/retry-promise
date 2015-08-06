var expect = require('chai').expect;
var retry = require('../');

describe('retry', function () {
  it('successful at first attempt', function () {
    var i;
    return retry(function (attempt) {
      i = attempt;
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          resolve('something');
        });
      });
    })
    .then(function (res) {
      expect(res).to.equal('something');
      expect(i).to.equal(1);
    });
  });

  it('unsuccessful', function () {
    var i;
    return retry({ max: 2, backoff: 20 }, function (attempt) {
      i = attempt;
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          reject('some err');
        });
      });
    })
    .catch(function (err) {
      expect(i).to.equal(2);
      expect(err).to.equal('some err');
    });
  });

});

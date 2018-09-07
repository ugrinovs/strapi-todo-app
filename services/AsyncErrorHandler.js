module.exports = function(promise, status) {
  return promise.then(req => req)
    .catch(err => {
      err.status = status;
      throw err;
    });
};
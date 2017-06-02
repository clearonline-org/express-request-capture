module.exports = function(options) {
  return function(req, res, next) {
    // Implement the middleware function based on the options object
    console.log('[express-request-capture]', req.ip);
    next()
  }
}

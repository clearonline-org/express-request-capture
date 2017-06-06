/*
 * 1. https://stackoverflow.com/questions/18538537/time-requests-in-nodejs-express
 * 2. https://github.com/expressjs/body-parser
 * 3. https://github.com/Raynos/body
 * 4. https://github.com/expressjs/express/issues/1816
 * 5. https://stackoverflow.com/questions/19215042/express-logging-response-body
 */
import capture  from './capture'; // captureRequestData
import printer from './printer';
export default function (options) {
  return function (req, res, next) {
    return capture(req, res, next) // capture calls next!
      .then(data => printer.print(data, options.channel, options))
      .catch(e => console.error(`[${new Date()}]-[express-request-capture]`, e));
  }
};
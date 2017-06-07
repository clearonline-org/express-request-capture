/**
 * 1. https://stackoverflow.com/questions/18538537/time-requests-in-nodejs-express
 * 2. https://github.com/expressjs/body-parser
 * 3. https://github.com/Raynos/body
 * 4. https://github.com/expressjs/express/issues/1816
 * 5. https://stackoverflow.com/questions/19215042/express-logging-response-body
 */

const textBody = require('body')
const jsonBody = require('body/json')
const formBody = require('body/form')
const anyBody = require('body/any')

module.exports = function (options) {
  return function (req, res, next) {
    // Implement the middleware function based on the options object

    // try to get the request body
    let bodyParser
    switch (req.get('content-type')) {
      case 'text/plain':
        bodyParser = new Promise(r => textBody(req, (err, body) => r(body)))
        break
      case 'application/x-www-form-urlencoded':
        bodyParser = new Promise(r => formBody(req, {}, (err, body) => r(body)))
        break
      case 'application/json':

        bodyParser = new Promise(r => jsonBody(req, res, (err, body) => r(body)))
      default:
        bodyParser = new Promise(r => anyBody(req, res, {}, (err, body) => r(body)))
        break
    }
    bodyParser.then(body => {
      let write = res.write
      let end = res.end
      let chunks = []
      res.write = function newWrite (chunk) {
        chunks.push(chunk)
        write.apply(res, arguments)
      }

      res.end = function newEnd (chunk) {
        if (chunk) { chunks.push(chunk) }
        end.apply(res, arguments)
      }

      const start = Date.now()
      res.once('finish', function () {
        const protocol = res.req.protocol || res.req.get('X-Forwarded-Protocol')
        const host = res.req.hostname || res.req.get('host')
        const path = res.req.originalUrl || res.req.url
        console.log('url', `${protocol}://${host}${path}`)

        const method = res.req.method
        console.log('method', method)

        const statusCode = res.statusCode
        console.log('status', statusCode)

        const latency = Date.now() - start
        console.log('latency', latency)

        const headers = res.req.headers
        console.log('request headers', headers)

        // const body = res.req.body;
        console.log('request body', body)

        // move on
        const sHost = res.req.get('host')
        console.log('request host', sHost)
        const clientIp = req.headers['x-forwarded-for'] || res.req.ip
        console.log('request clientIp', clientIp)

        const rHeaders = res._headers
        console.log('response headers', rHeaders)

        const isBuffer = input => input instanceof Buffer
        const rBody = isBuffer(chunks[0]) ? Buffer.concat(chunks).toString('utf8') : chunks.toString()
        console.log('response body', rBody)
      })

      next()
    })
      .catch(e => {
        console.log(e)
        next()
      })
  }
}

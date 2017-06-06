'use strict';

const textBody = require("body");
const jsonBody = require("body/json");
const formBody = require("body/form");
const anyBody = require("body/any");

const ContentTypes = {
  TEXT_PLAIN: 'text/plain',
  APPLICATION_FORM: 'application/x-www-form-urlencoded',
  APPLICATION_JSON: 'application/json'
};

/**
 * 
 * @param contentType {string} req.get('content-type')
 * @param req {Express.Request}
 * @param res {Express.Response}
 * @param options { [key: number|string]: any } 
 * @returns Promise< string | { [key: number|string]: any }> the parsed body
 */
function parseRequestBody(contentType, req, res, options) {
  let bodyParser;
  switch (contentType) {
    case ContentTypes.TEXT_PLAIN:
      bodyParser = new Promise(r => textBody(req, (err, body) => r(body)));
      break;
    case ContentTypes.APPLICATION_FORM:
      bodyParser = new Promise(r => formBody(req, {}, (err, body) => r(body)));
      break;
    case ContentTypes.APPLICATION_JSON:
      bodyParser = new Promise(r => jsonBody(req, res, (err, body) => r(body)));
    default:
      bodyParser = new Promise(r => anyBody(req, res, {}, (err, body) => r(body)));
      break;
  }

  return bodyParser;
}


/**
 * @dependancy: called after parseRequestBody
 * @param res Express.Response
 * @param options { [key: number|string]: any }
 * @return Promise<string | { [key: number|string]: any }> the parsed body
 */
function parseResponseBody(res, options, next) {
  return new Promise((resolve, reject) => {
    let write = res.write;
    let end = res.end;
    let chunks = [];
    res.write = function newWrite(chunk) {
      chunks.push(chunk);
      write.apply(res, arguments);
    };

    res.end = function newEnd(chunk) {
      if (chunk) { 
        // chunks.push(chunk); 
      }
      end.apply(res, arguments);
    };

    res.once('finish', function () {
      const isBuffer = input => input instanceof Buffer;
      const responseBody = isBuffer(chunks[0]) ? Buffer.concat(chunks).toString('utf8') : chunks.toString();
      console.log('response body', arguments);

      // @TODO here is where you compute the latency

      return resolve(responseBody);
    });
    return next();

  });
}

/**
 * @dependancy: called after parseResponseBody
 * @param req {Express.Request}
 * @returns Promise< string | { [key: number|string]: any }> the parsed body
 */
function parseUrl(req) {
  const protocol = req.protocol || req.get('X-Forwarded-Protocol');
  const host = req.hostname || req.get('host');
  const path = req.originalUrl || req.url;
  // console.log('url', `${protocol}://${host}${path}`);

  return `${protocol}://${host}${path}`;
}

/**
 * @dependancy: called after parseResponseBody
 * @param req {Express.Request}
 * @returns { method: string, headers: { [key: string]: string|number }, host: string, clientIp: string }
 */
function parseRequestMeta(req) {
  const method = req.method;
  // console.log('method', method);

  const headers = req.headers;
  // console.log('request headers', headers);

  const host = req.get('host');
  // console.log('request host', host);
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  // console.log('request clientIp', clientIp);


  return { method, headers, host, clientIp };
}

/**
 * @dependancy: called after parseResponseBody
 * @param res {Express.Response}
 * @returns { status: string, headers: { [key: string]: string|number } }
 */
function parseResponseMeta(res) {

  const headers = res._headers;
  // console.log('response headers', headers);

  const status = res.statusCode;
  // console.log('status', status);

  return { headers, status };
}


/**
 * the middleware entry
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @return Promise<{url: string, request: { method, headers, host, clientIp, payload }, respone: { headers, status, payload }, latency: number }>
 */
function capture(req, res, next) {
  const start = Date.now();
  const contentType = req.get('content-type');
  let options = {};
  let data = { url: '', request: {}, respone: {}, latency: 0 }; // output
  return parseRequestBody(contentType, req, res, options)
    .then(payload => { // => request body
      data.request = Object.assign({}, data.request, { payload });
      let options = {};
      return parseResponseBody(res, options, next);
    })
    .catch(e => {
      next();
      // in here we should stop the execution
      return Promise.reject(e);
    })
    .then(payload => { // => response body
      data.respone = Object.assign({}, data.respone, { payload });

      let url = parseUrl(req);
      data = Object.assign({}, data, { url });

      let { method, headers, host, clientIp } = parseRequestMeta(req);
      data.request = Object.assign({}, data.request, { method, headers, host, clientIp });
      
      return Promise.resolve(data);
    })
    .then(data => { // => response meta

      let { headers, status } = parseResponseMeta(res);
      data.respone = Object.assign({}, data.respone, { headers, status });

      let latency = Date.now() - start;
      data = Object.assign({}, data, { latency });

      return Promise.resolve(data);
    });
  // let the index file catch whatever fails
}

function print(data, channel, options) {
    console.log(data);
    return Promise.resolve(true);
}

var printer = {
    print
};

/*
 * 1. https://stackoverflow.com/questions/18538537/time-requests-in-nodejs-express
 * 2. https://github.com/expressjs/body-parser
 * 3. https://github.com/Raynos/body
 * 4. https://github.com/expressjs/express/issues/1816
 * 5. https://stackoverflow.com/questions/19215042/express-logging-response-body
 */
var index = function (options) {
  return function (req, res, next) {
    return capture(req, res, next) // capture calls next!
      .then(data => printer.print(data, options.channel, options))
      .catch(e => console.error(`[${new Date()}]-[express-request-capture]`, e));
  }
};

module.exports = index;

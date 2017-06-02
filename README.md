# express-request-capture
Node.js express middleware for capturing HTTP request and responses

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## Install

```bash
$ npm install express-request-capture
```

## API

```js
var requestCapture = require ('express-request-capture')
```

### requestCapture ()
TODO what the middleware outputs

## Examples


### Express / Connect
When using this module with express or connect, simply `app.use` the module.
Request information `url, request, response, status, latency, and clientIp`, is printed/stored to the specified channel!
```js
var requestCapture = require ('express-request-capture'),
    express = require ('express')

var app = express()

var printAdapter = { channel: 'console|http|mongo|mysql', url: 'required if channel is either http or database' };
app.use(requestCapture(printAdapter))
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-request-capture.svg?style=flat
[npm-url]: https://npmjs.org/package/express-request-capture
[downloads-image]: https://img.shields.io/npm/dm/express-request-capture.svg?style=flat
[downloads-url]: https://npmjs.org/package/express-request-capture

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

### requestCapture ({ channel: string, url?: string })

When using this module with express or connect, simply `app.use` the module.
Request information `url, request, response, status, latency, and clientIp`, is printed/stored to the specified channel!
```js
var requestCapture = require ('express-request-capture'),
    express = require ('express')

var app = express()

var printAdapter = { channel: 'console|http|mongo|mysql', url: 'required if channel is either http or database' };
app.use(requestCapture(printAdapter))
```

```js
// sample response
{
    url: "https://alert.clearonline.org/api/v1/subscribe",
    method: "POST",
    status: 200,
    latency: 100,
    request: {
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            email: "hello@clearonline.org",
            trigger: "solar energy"
        },
        host: "localhost:3000",
        ip: "127.0.0.1"
    },
    response: {
        header: {
            "Date": "2017-06-02T22:29:44.315Z"
        },
        body: {
            message: "Thank you for subscribing, i will send you notes every monday!"
        }
    },
    clientIp: "192.111.1.1"
}
```

## Examples

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-request-capture.svg?style=flat
[npm-url]: https://npmjs.org/package/express-request-capture
[downloads-image]: https://img.shields.io/npm/dm/express-request-capture.svg?style=flat
[downloads-url]: https://npmjs.org/package/express-request-capture

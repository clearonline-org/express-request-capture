# express-request-capture
Node.js express middleware for capturing HTTP requests and responses

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## Install

```bash
$ npm install @clearonline/express-request-capture
```

## API

```js
var requestCapture = require ('@clearonline/express-request-capture')
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
        clientIp: "192.111.1.1"
    },
    response: {
        header: {
            "Date": "2017-06-02T22:29:44.315Z"
        },
        body: {
            message: "Thank you for subscribing, i will send you notes every monday!"
        }
    }
}
```

## Examples

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@clearonline/express-request-capture.svg?style=flat
[npm-url]: https://npmjs.org/package/@clearonline/express-request-capture
[downloads-image]: https://img.shields.io/npm/dm/@clearonline/express-request-capture.svg?style=flat
[downloads-url]: https://npmjs.org/package/@clearonline/express-request-capture

## Chanelog

### [06-02-2017] only console is supported

# Blog

## Description

Monitoring your web app is one the many ways to prevent hackers from breaking your app. In this tutorial, we do this by creating an expressjs middleware that logs all information related to the received request and return response.

## Goal

Capture all requests (request and response) that my express application handles.

## Step by Step

* 1. initialize npm package

```sh
mkdir express-request-capture && cd express-request-capture
npm init -y
```

* 2. create `index.js` file

```sh
# this will be the entry/main file of our middleware
touch index.js
```

* 3. add content to `index.js` file

```js
module.exports = require('./src/capture.js')
```

* 3. create the `src` folder

```sh
mkdir src
```

* 3. create a `capture.js` file inside `src`

* 4. put logic inside the `capture.js` file

* 5. publish to npm

```sh
npm login
npm publish
```

* 6. use the middleware

```sh

```



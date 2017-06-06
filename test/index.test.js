const express = require('express')
const app = express()

app.use(require('../index.js')({ channel: 'console' }));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/api/v1/subscribe', function (req, res) {
  res.send({ message: 'Thank you for subscribing, i will send you notes every monday!' })
})
app.post('/api/v1/subscribe', function (req, res) {
  res.json({ message: 'Thank you for subscribing, i will send you notes every monday!' })
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
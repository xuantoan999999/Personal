const express = require('express')
const app = express()
const port = 2200;

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(port, function () {
  console.log(`Example app listening on port ${{port}}!`)
})
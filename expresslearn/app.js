const express = require('express')
const port = 2200;
const app = express();
module.exports = app;

require('./boostrap/boostrap');

app.listen(port, () => {
  console.log(`Go to http://localhost:${port}`)
})

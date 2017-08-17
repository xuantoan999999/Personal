const express = require('express')
const app = express();
const config = require('./config/config');
module.exports = app;

require('./boostrap/boostrap');

app.listen(config.port, () => {
  console.log(`Go to http://localhost:${config.port}`)
})

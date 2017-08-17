const config = require('./../config/config');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require("path");

mongoose.connect(config.db.uri, { useMongoClient: true });
require('mongoose-pagination');

let link = path.resolve(__dirname, './../app/model');
let list = fs.readdirSync(link).forEach((item) => {
    require(`${link}/${item}`);
});;
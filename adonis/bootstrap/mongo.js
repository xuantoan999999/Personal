const mongoose = require('mongoose')
const Glob = require('Glob')
const Path = require('path');
const config = require('./../config/mongo')

mongoose.connect('mongodb://' + config.host + '/' + config.database);
mongoose.Promise = require('bluebird');
require('mongoose-pagination');
let models = Glob.sync(process.cwd() + '/app/Model/*.js', {});
models.forEach((item) => {
    require(Path.resolve(item));
});
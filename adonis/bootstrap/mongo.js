const mongoose = require('mongoose')
const Glob = require('Glob')
const Path = require('path');
const Env = use('Env')

mongoose.connect('mongodb://localhost/' + Env.get('DB_DATABASE'));
mongoose.Promise = require('bluebird');
require('mongoose-pagination');
let models = Glob.sync(process.cwd() + '/app/Model/*.js', {});
models.forEach((item) => {
    require(Path.resolve(item));
});
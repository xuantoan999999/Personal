const Ioc = require('adonis-fold').Ioc
const MongoSerializer = require('./MongoSerializer')
Ioc.extend('Adonis/Src/AuthManager', 'mongo', function (app) {
    console.log('-----------------------------------------------');
    return new MongoSerializer()
}, 'serializer')
